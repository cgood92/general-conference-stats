import unittest
from build_insights import count_terms, extract_references, extract_invitations, scripture_from_link, annotated_references, recognized_people

class AnalysisTest(unittest.TestCase):
 def test_phrase_boundaries_and_case(self):
  terms=count_terms('Temple temples contemporary. Covenant path, covenant path! Elohim.')
  self.assertEqual(terms['covenant path'],2)
  self.assertEqual(terms['elohim'],1)
  self.assertNotIn('the',terms)
 def test_explicit_scripture_and_person_attribution(self):
  refs=extract_references('President Russell M. Nelson taught, “Choose joy.” Read John 3:16 and 1 Nephi 3:7.', ['Russell M. Nelson'])
  self.assertEqual({r['label'] for r in refs},{'Russell M. Nelson','John 3:16','1 Nephi 3:7'})
  self.assertEqual(next(r for r in refs if r['kind']=='person')['relation'],'attributed quotation')
 def test_mention_does_not_become_a_quotation(self):
  refs=extract_references('I saw Russell M. Nelson yesterday.', ['Russell M. Nelson'])
  self.assertEqual(refs[0]['relation'],'mentions')
 def test_invitation_and_blessing_need_source_evidence(self):
  items=extract_invitations('I invite you to pray each morning. As you do, you will find peace. The weather is fine.')
  self.assertEqual(len(items),1)
  self.assertIn('find peace', items[0]['blessing'])
  self.assertEqual(extract_invitations('Yesterday I walked to school.'),[])

 def test_numbered_books_with_nonbreaking_spaces(self):
  self.assertEqual(extract_references('2\u00a0Nephi 25:23',[])[0]['label'],'2 Nephi 25:23')
 def test_canonical_link_preserves_the_exact_verse_range(self):
  ref=scripture_from_link({'label':'verse 13', 'url':'https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/7?lang=eng&id=p13-p14#p13'})
  self.assertEqual(ref['label'],'Alma 7:13–14')
  self.assertIn('id=p13-p14',ref['source'])
 def test_guide_entries_are_not_mislabeled_as_scripture_verses(self):
  self.assertIsNone(scripture_from_link({'label':'Grace','url':'https://www.churchofjesuschrist.org/study/scriptures/bd/grace'}))

 def test_footnote_display_variants_do_not_duplicate_canonical_citations(self):
  notes={'notes':[{'id':'note1','text':'1 Nephi 11:16, 17.','excerpt':'He invited us to ponder.','scriptures':[{'label':'1 Nephi 11:16, 17','url':'https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/11?id=p16-p17'}]}]}
  refs=annotated_references('He invited us to ponder.', [], notes, 'https://example.com/talk')
  self.assertEqual([r['label'] for r in refs],['1 Nephi 11:16–17'])
 def test_missing_footnote_context_does_not_delete_unrelated_inline_references(self):
  notes={'notes':[{'id':'note1','text':'John 3:16.','excerpt':'','scriptures':[]}]}
  refs=annotated_references('Read John 3:16 today.', [], notes, 'https://example.com/talk')
  self.assertEqual(len(refs),2)


class ReferenceRegressionTest(unittest.TestCase):
 def test_abbreviated_inline_scripture_uses_canonical_link(self):
  enriched={'inlineScriptures':[{'label':'1 Cor. 13:13','url':'https://www.churchofjesuschrist.org/study/scriptures/nt/1-cor/13?id=p13','excerpt':'Paul taught (1 Cor. 13:13).'}]}
  refs=annotated_references('Paul taught (1 Cor. 13:13).',[],enriched,'https://example.com/talk')
  self.assertEqual([r['label'] for r in refs],['1 Corinthians 13:13'])
 def test_footnote_does_not_hide_other_verses_in_same_chapter(self):
  enriched={'notes':[{'id':'note1','text':'John 3:16; John 3:17.','excerpt':'Read both verses.','scriptures':[{'label':'John 3:16','url':'https://www.churchofjesuschrist.org/study/scriptures/nt/john/3?id=p16'}]}]}
  refs=annotated_references('Read both verses.',[],enriched,'https://example.com/talk')
  self.assertEqual({r['label'] for r in refs},{'John 3:16','John 3:17'})
 def test_citation_text_is_used_before_lossy_body_text(self):
  enriched={'referenceText':'Russell M. Nelson taught, “Choose joy.”'}
  refs=annotated_references('taught, “Choose joy.”',['Russell M. Nelson'],enriched,'https://example.com/talk')
  self.assertEqual(refs[0]['label'],'Russell M. Nelson')
 def test_book_chapter_citation_without_a_verse_stays_chapter_only(self):
  ref=scripture_from_link({'label':'Alma 7','url':'https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/7?lang=eng'})
  self.assertEqual(ref['label'],'Alma 7')
 def test_repeated_note_anchors_retain_distinct_contexts(self):
  enriched={'notes':[{'id':'note1','text':'John 3:16.','excerpt':'First quote.','contexts':[{'excerpt':'First quote.'},{'excerpt':'Second quote.'}],'scriptures':[]}]}
  refs=annotated_references('First quote. Second quote.',[],enriched,'https://example.com/talk')
  self.assertEqual([r['excerpt'] for r in refs],['First quote.','Second quote.'])

class AttributionRegressionTest(unittest.TestCase):
 def test_later_sentence_does_not_attribute_its_quote_to_an_earlier_name(self):
  refs=extract_references('I met Russell M. Nelson. Someone else taught, “Choose joy.”',['Russell M. Nelson'])
  self.assertEqual(refs[0]['relation'],'mentions')
 def test_quotation_before_the_name_is_attributed(self):
  refs=extract_references('“Choose joy,” said President Russell M. Nelson.',['Russell M. Nelson'])
  self.assertEqual(refs[0]['relation'],'attributed quotation')
 def test_link_to_known_talk_identifies_author_without_guessing_surnames(self):
  note={'id':'note1','text':'See “Choose joy.”','excerpt':'Choose joy.','scriptures':[],'links':[{'label':'Choose joy','url':'https://www.churchofjesuschrist.org/study/general-conference/2024/04/47nelson?lang=eng'}]}
  refs=annotated_references('Choose joy.',[],{'notes':[note]},'https://example.com/talk',{'/study/general-conference/2024/04/47nelson':'Russell M. Nelson'})
  self.assertEqual(refs[0]['label'],'Russell M. Nelson')


class SourceAccuracyTest(unittest.TestCase):
 def test_scripture_footnote_link_does_not_invent_a_chapter_only_citation(self):
  link={'label':'Matthew 26:26, footnote c','url':'https://www.churchofjesuschrist.org/study/scriptures/nt/matt/26?id=note26c#note26c'}
  self.assertEqual(scripture_from_link(link)['label'],'Matthew 26:26')
 def test_missing_verse_anchor_uses_explicit_display_verses(self):
  link={'label':'John 3:16','url':'https://www.churchofjesuschrist.org/study/scriptures/nt/john/3'}
  self.assertEqual(scripture_from_link(link)['label'],'John 3:16')
 def test_scripture_translation_is_distinct_from_ordinary_bible_verse(self):
  link={'label':'JST, Matt. 6:38','url':'https://www.churchofjesuschrist.org/study/scriptures/nt/matt/6?id=note33a'}
  self.assertEqual(scripture_from_link(link)['label'],'Joseph Smith Translation, Matthew 6:38')
 def test_subject_inside_quote_is_not_labeled_as_citation_author(self):
  note={'id':'note1','text':'“He restored the keys to Joseph Smith.” (Henry B. Eyring, “Rise to Your Call,” 2002).','excerpt':'He restored the keys.','scriptures':[]}
  refs=annotated_references('He restored the keys.',['Joseph Smith','Henry B. Eyring'],{'notes':[note]},'https://example.com/talk')
  self.assertEqual(next(r for r in refs if r['label']=='Joseph Smith')['relation'],'mentions')
  self.assertEqual(next(r for r in refs if r['label']=='Henry B. Eyring')['relation'],'footnote citation')

 def test_historical_prophet_catalog_is_used_without_recent_talks(self):
  people=recognized_people([])
  refs=extract_references('Joseph Smith, “Journal, December 1842–June 1844.”',people)
  self.assertEqual(refs[0]['label'],'Joseph Smith')
  self.assertIn('Brigham Young',people)

if __name__=='__main__': unittest.main()
