import sys
import logging
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TextSummarizer:
    def __init__(self, language="english", method="lexrank", sentence_count=4):
        self.language = language
        self.method = method
        self.sentence_count = sentence_count
        self.summarizer = self._initialize_summarizer()

    def _initialize_summarizer(self):
        if self.method == "lexrank":
            logger.info("Using LexRank summarization method.")
            return LexRankSummarizer()
        else:
            raise NotImplementedError(f"Method '{self.method}' not implemented.")

    def summarize(self, text: str) -> str:
        if not text or len(text.strip()) < 20:
            logger.warning("Text too short to summarize.")
            return text

        try:
            logger.info("Starting summarization process.")
            parser = PlaintextParser.from_string(text, Tokenizer(self.language))
            summary = self.summarizer(parser.document, self.sentence_count)

            result = " ".join(str(sentence) for sentence in summary)
            logger.info("Summarization complete.")
            return result

        except Exception as e:
            logger.error(f"Error during summarization: {e}")
            return "Error: Summarization failed."

# CLI usage
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python summarizer.py 'Your long text here'")
        sys.exit(1)

    input_text = sys.argv[1]
    summarizer = TextSummarizer()
    output = summarizer.summarize(input_text)
    print(output)
