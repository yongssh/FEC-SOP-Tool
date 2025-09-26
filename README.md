Journalists face challenges reporting on political campaigns. This is a web service that manipulates and analyzes documents and data from the Federal Election Commission (FEC). 
This project provides: easier analysis of “Form 1: Statement of Organization” documents to identify potential sources and computation of donation share to a candidate’s campaign.

## Features:
### Compress + Upload:
- Input a PDF of FEC Form 1: Statement of Organization. 
- Use pypdf’s pdfwriter to compress the PDF and upload it to an S3 bucket.

### OCR + download:
- Convert pdf to png with pdf2image.
- Amazon Textract to apply Optical Character Recognition (OCR) to the converted document.
- Retrieve the text string to parse with Python re library.
- The report returns a JSON that tells us: committee name, the address, emails, and the name and phone number of the treasurer.

### Compute & Report:
- Takes candidate, contributor IDs, and time period as inputs
- Calls on OpenFEC API to retrieve external data
- Calculates and outputs organized JSON of what percent of a candidate’s campaign fundraising in a given election cycle came from the contributor of interest.




