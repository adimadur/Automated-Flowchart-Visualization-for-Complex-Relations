import sys
import logging
import nltk
# import spacy
from collections import defaultdict
from heapq import nlargest

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Download required NLTK resources
nltk.download("punkt")
nltk.download("stopwords")

from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize

# Load spaCy English model
nlp = "Load"

class NLPSummarizer:
    def __init__(self, sentence_count=5):
        self.stop_words = set(stopwords.words("english"))
        self.sentence_count = sentence_count

    def preprocess(self, text):
        logger.info("Preprocessing text...")
        doc = nlp(text)
        word_freq = defaultdict(int)

        for token in doc:
            if token.text.lower() not in self.stop_words and token.is_alpha:
                word_freq[token.text.lower()] += 1

        logger.info("Word frequency computed.")
        return word_freq

    def score_sentences(self, text, word_freq):
        logger.info("Scoring sentences...")
        sentences = sent_tokenize(text)
        sentence_scores = {}

        for sentence in sentences:
            word_count = 0
            for word in word_tokenize(sentence.lower()):
                if word in word_freq:
                    sentence_scores[sentence] = sentence_scores.get(sentence, 0) + word_freq[word]
                    word_count += 1
            if word_count > 0:
                sentence_scores[sentence] /= word_count  # Normalize by length

        logger.info("Sentence scoring complete.")
        return sentence_scores

    def summarize(self, text):
        if not text or len(text.strip()) < 30:
            logger.warning("Text too short to summarize.")
            return text

        word_freq = self.preprocess(text)
        sentence_scores = self.score_sentences(text, word_freq)

        best_sentences = nlargest(self.sentence_count, sentence_scores, key=sentence_scores.get)

        logger.info("Summary generated.")
        return " ".join(best_sentences)

# CLI usage
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python nlp_summarizer.py 'Your long text here'")
        sys.exit(1)

    input_text = sys.argv[1]
    summarizer = NLPSummarizer(sentence_count=4)
    summary = summarizer.summarize(input_text)
    print(summary)
