"""Reproducible, offline conference analysis. Run from repository root.
Uses only the Python standard library and structured evidence from case2.
"""
import collections, json, re, gzip
from functools import lru_cache
from pathlib import Path
from urllib.parse import urlparse, parse_qs

STOP=set('a an the and or but if as at by for from in into of on out over to up with without about above after again against all am are be been being below between both can cannot could did do does doing down during each few further had has have having he her here hers herself him himself his how i is it its itself just me more most my myself no nor not now off once only other our ours ourselves own same she should so some such than that their theirs them themselves then there these they this those through too under until very was we were what when where which while who whom why will would you your yours yourself yourselves shall may might must also us unto upon'.split())
BOOKS=['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalm','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation','1 Nephi','2 Nephi','Jacob','Enos','Jarom','Omni','Words of Mormon','Mosiah','Alma','Helaman','3 Nephi','4 Nephi','Mormon','Ether','Moroni','Doctrine and Covenants','D&C','Moses','Abraham','Joseph Smith—Matthew','Joseph Smith—History','Articles of Faith']
SCRIPTURE=re.compile(r'\b('+ '|'.join(re.escape(b) for b in sorted(BOOKS,key=len,reverse=True))+r')\s+(\d+)(?::(\d+(?:\s*[–—-]\s*\d+)?(?:\s*,\s*\d+(?:\s*[–—-]\s*\d+)?)*)|\b)',re.I)
HISTORICAL_PEOPLE={'Joseph Smith','Brigham Young','John Taylor','Wilford Woodruff','Lorenzo Snow','Joseph F. Smith','Heber J. Grant','George Albert Smith','David O. McKay','Hyrum Smith','Lucy Mack Smith','Joseph Smith Sr.'}
EXTERNAL_AUTHORS={'C. S. Lewis','William Shakespeare','Martin Luther King Jr.','Mother Teresa','Dietrich Bonhoeffer'}

def recognized_people(talks):
 return sorted({t.get('speaker','') for t in talks if len(t.get('speaker','').split())>=2}|HISTORICAL_PEOPLE|EXTERNAL_AUTHORS)

def words(text): return re.findall(r"[a-z]+(?:'[a-z]+)?",text.lower().replace('’',"'"))
def count_terms(text):
 tokens=words(text)
 result=collections.Counter(t for t in tokens if t not in STOP and len(t)>2)
 # Do not form phrases across sentence/paragraph boundaries.
 for sentence in re.split(r'[.!?;:\n]+', text):
  ts=words(sentence)
  for n in (2,3,4):
   for i in range(len(ts)-n+1):
    group=ts[i:i+n]
    if group[0] not in STOP and group[-1] not in STOP and all(len(w)>1 for w in group): result[' '.join(group)]+=1
 return result

def context(text,start,end):
 left=max(text.rfind('\n',0,start),text.rfind('. ',0,start))
 right=text.find('\n',end)
 return text[max(0,left+1): min(len(text),right if right>=0 else end+220)].strip()[:650]

@lru_cache(maxsize=4)
def people_pattern(people):
 return re.compile(r'(?<!\w)(?:'+'|'.join(re.escape(p) for p in sorted(people,key=len,reverse=True))+r')(?!\w)' if people else r'(?!)',re.I)

def extract_references(text,people):
 text=text.replace('\u00a0',' ')
 refs=[]
 for m in SCRIPTURE.finditer(text):
  book=next((b for b in BOOKS if b.lower()==m[1].lower()),m[1])
  if book=='D&C': book='Doctrine and Covenants'
  if book=='Psalm': book='Psalms'
  if re.search(r'(?:Joseph Smith Translation|JST),?\s*$',text[max(0,m.start()-35):m.start()],re.I): book='Joseph Smith Translation, '+book
  label=book+' '+m[2]+(':'+re.sub(r'\s+','',m[3]).replace('—','–').replace('-','–') if m[3] else '')
  refs.append({'label':label,'kind':'scripture','relation':'explicit reference','excerpt':context(text,m.start(),m.end())})
 for m in people_pattern(tuple(people)).finditer(text):
  name=next((p for p in people if p.lower()==m.group().lower()),m.group())
  excerpt=context(text,m.start(),m.end())
  following=text[m.end():m.end()+110]
  verbs=r'(?:said|taught|wrote|declared|explained|testified|counseled|observed|reminded|stated|promised)'
  forward=re.search(r'^\s*,?\s*(?:once\s+)?'+verbs+r'\b[^.!?]*[“"‘]',following,re.I)
  before=text[max(0,m.start()-120):m.start()]
  backward=re.search(r'[”"’]\s*,?\s*'+verbs+r'\s+(?:(?:President|Elder|Sister|Brother|Dr\.)\s+)?$',before,re.I)
  attributed=bool(forward or backward)
  refs.append({'label':name,'kind':'person','relation':'attributed quotation' if attributed else 'mentions','excerpt':excerpt})
 return refs

# Canonical book IDs come from the linked source, not display text abbreviations.
BOOK_IDS=dict(zip('gen ex lev num deut josh judg ruth 1-sam 2-sam 1-kgs 2-kgs 1-chr 2-chr ezra neh esth job ps prov eccl song isa jer lam ezek dan hosea joel amos obad jonah micah nahum hab zeph hag zech mal matt mark luke john acts rom 1-cor 2-cor gal eph philip col 1-thes 2-thes 1-tim 2-tim titus philem heb james 1-pet 2-pet 1-jn 2-jn 3-jn jude rev 1-ne 2-ne jacob enos jarom omni w-of-m mosiah alma hel 3-ne 4-ne morm ether moro dc moses abr js-m js-h a-of-f'.split(),[b for b in BOOKS if b not in ['Psalm','D&C']]))

def scripture_from_link(link):
 parsed=urlparse(link['url']); parts=parsed.path.split('/')
 if 'scriptures' not in parts: return None
 path=parts[parts.index('scriptures')+1:]
 if len(path)<3 or not path[2].isdigit(): return None
 code=path[1]; book=BOOK_IDS.get(code.replace('jst-',''))
 if not book: return None
 if path[0]=='jst' or re.search(r'Joseph Smith Translation|\bJST\b',link.get('label',''),re.I): book='Joseph Smith Translation, '+book
 verse=''
 for target in [parse_qs(parsed.query).get('id',[''])[0],parsed.fragment]:
  candidate=re.sub(r'p(?=\d)','',target).replace('-', '–')
  if re.fullmatch(r'\d+(?:[–,]\d+)*',candidate):
   verse=candidate; break
 if not verse:
  display=re.search(r'(?<!\d)'+re.escape(path[2])+r':(\d+(?:\s*[–—-]\s*\d+)?(?:\s*,\s*\d+(?:\s*[–—-]\s*\d+)?)*)',link.get('label',''))
  if display: verse=re.sub(r'\s+','',display[1]).replace('—','–').replace('-','–')
 return {'label':book+' '+path[2]+(':'+verse if verse else ''),'kind':'scripture','relation':'footnote citation','excerpt':'','source':link['url']}

def reference_identity(ref):
 # Treat a linked contiguous range and an equivalent comma list as one citation.
 label=ref['label']
 if ref['kind']!='scripture' or ':' not in label: return label
 chapter,verses=label.split(':',1)
 result=set()
 for group in verses.split(','):
  bounds=group.replace('–','-').split('-')
  if not all(v.isdigit() for v in bounds): return label
  start=int(bounds[0]); end=int(bounds[-1])
  if end-start>1000: return label
  result.update(range(start,end+1))
 return chapter,tuple(sorted(result))

def annotated_references(text,people,enriched,url,speakers_by_url=None):
 refs=extract_references(enriched.get('referenceText') or text,people)
 def add_context(candidates,excerpt,source,relation):
  nonlocal refs
  unique=[]; seen=set()
  for ref in sorted(candidates,key=lambda r:r['relation']=='mentions'):
   identity=reference_identity(ref)
   if identity in seen: continue
   seen.add(identity)
   effective=ref['relation'] if ref['kind']=='person' and ref['relation']=='mentions' else relation
   ref=dict(ref,excerpt=excerpt[:650],relation=effective)
   ref.setdefault('source',source)
   unique.append(ref)
  identities={reference_identity(r) for r in unique}
  passage=re.sub(r'\s+',' ',excerpt).strip()
  if passage:
   refs=[r for r in refs if not (reference_identity(r) in identities and (re.sub(r'\s+',' ',r['excerpt']).strip() in passage or passage in re.sub(r'\s+',' ',r['excerpt']).strip()))]
  refs.extend(unique)
 for link in enriched.get('inlineScriptures',[]):
  ref=scripture_from_link(link)
  if ref: add_context([ref],link.get('excerpt') or link['label'],link['url'],'inline citation')
 for note in enriched.get('notes',[]):
  linked=[r for link in note.get('scriptures',[]) if (r:=scripture_from_link(link))]
  candidates=linked+extract_references(note['text'],people)
  # A person inside a quoted passage is a subject, not necessarily its author.
  for ref in candidates:
   if ref['kind']!='person' or ref['relation']!='mentions': continue
   for match in re.finditer(re.escape(ref['label']),note['text'],re.I):
    before=note['text'][:match.start()]; after=note['text'][match.end():]
    boundary=re.search(r'(?:^|[;(])\s*(?:(?:See|see also)\s+)?(?:(?:President|Elder|Sister|Brother)\s+)?$',before,re.I)
    if boundary and re.match(r'\s*,',after) and before.count('“')==before.count('”'):
     ref['relation']='footnote citation'; break
  # An explicit link to a known talk identifies its author even if the note omits the name.
  for link in note.get('links',[]):
   speaker=(speakers_by_url or {}).get(urlparse(link['url']).path)
   if speaker: candidates.append({'label':speaker,'kind':'person','relation':'footnote citation','excerpt':'','source':link['url']})
  contexts=note.get('contexts') or [{'excerpt':note.get('excerpt','')}]
  for context in contexts:
   add_context(candidates,context.get('excerpt') or note['text'],url.split('#')[0]+'#'+note['id'],'footnote citation')
 return refs

def write_index(output,root):
 folder=root/'site/public/insights'; folder.mkdir(parents=True,exist_ok=True)
 summary=[]
 def write(path,value):
  data=json.dumps(value,separators=(',',':'),ensure_ascii=False).encode()
  path.write_bytes(data)
  path.with_suffix(path.suffix+'.gz').write_bytes(gzip.compress(data,mtime=0))
  return len(data)
 for conference in output['conferences']:
  write(folder/(str(conference['key'])+'.json'),conference)
  thin=[]
  for talk in conference['talks']:
   t=dict(talk)
   t['references']=[{k:v for k,v in dict(r,excerpt='').items() if k!='source'} for r in t['references']]
   t['invitations']=[]
   thin.append(t)
  summary.append({'key':conference['key'],'talks':thin})
 write(root/'site/public/insights-index.json',dict(output,conferences=summary))
 print('Wrote summary index and per-conference evidence files',flush=True)

def extract_invitations(text):
 sentences=re.split(r'(?<=[.!?])\s+|\n+',text)
 result=[]
 for i,sentence in enumerate(sentences):
  if re.search(r'\b(?:I|we) (?:invite|urge|encourage|challenge|plead with|ask) you\b|\bplease (?:consider|remember|seek|pray|come|take|make|listen|choose|read|study|be|help|love|forgive)\b',sentence,re.I):
   nearby=' '.join(sentences[i:i+4])
   blessing=next((s for s in sentences[i:i+4] if re.search(r'\b(?:you will|we will|bless|promise|peace|joy|healing|strength|happiness)\b',s,re.I)), '')
   result.append({'excerpt':nearby[:850],'blessing':blessing[:450]})
 return result[:6]

def main():
 root=Path(__file__).resolve().parents[1]
 conferences=[]; talks=[]
 for path in sorted((root/'case2/output').glob('????-??.json')):
  raw=json.loads(path.read_text())
  if not raw: continue
  conf={'key':raw[0]['dateKey'],'talks':[]}
  for t in raw:
   if not t.get('content'): continue
   t=dict(t,id=len(talks)); conf['talks'].append(t); talks.append(t)
  conferences.append(conf)
 print(f'Analyzing {len(talks)} talks / {len(conferences)} conferences',flush=True)
 people=recognized_people(talks)
 speakers_by_url={urlparse(t['url']).path:t.get('speaker','') for t in talks}
 counts=[count_terms(t['content']) for t in talks]
 global_counts=collections.Counter(); doc_counts=collections.Counter()
 for c in counts: global_counts.update(c); doc_counts.update(c.keys())
 vocab={term for term,count in global_counts.items() if (count>=3 and ' ' not in term) or (count>=6 and doc_counts[term]>=2 and ' ' in term)}
 phrases=sorted((t for t in vocab if ' ' in t),key=lambda t:(doc_counts[t],global_counts[t]),reverse=True)[:6500]
 vocab={t for t in vocab if ' ' not in t}|set(phrases)
 for t,c in zip(talks,counts):
  if t['id']%500==0: print(f"Extracting {t['id']}/{len(talks)}",flush=True)
  raw_text=t['content']; evidence=t.get('references',{})
  t['words']=len(words(raw_text)); t['terms']={k:v for k,v in c.items() if k in vocab}
  t['invitations']=extract_invitations(raw_text)
  t['referenceCoverage']=evidence.get('coverage','unavailable')
  t['referenceDiagnostics']=evidence.get('diagnostics',{})
  t['references']=annotated_references(raw_text,people,evidence,t['url'],speakers_by_url)
  for k in ['content','month','year','dateKey']: t.pop(k,None)
 write_index({'methodVersion':3,'conferences':conferences},root)


if __name__=='__main__': main()
