# Download S3

GitHub action to download files from S3 Service(AWS or self-hosted Minio).

## Usage

See [action.yml](action.yml)

## Inputs

- `aws_access_key_id`: (__Required__) The AWS access key ID.
- `aws_secret_access_key`: (__Required__) The AWS secret access key.
- `aws_region`: (__Required__) The region to send service requests to.
- `aws_bucket`: (__Required__) The bucket name containing the files to download.
- `endpoint`: The endpoint URL of the bucket. Default is `https://s3.amazonaws.com`. Use this if you are using a different S3 provider, like `https://s3.example.com`.
- `source`: The directory (or file path) on the bucket to which you want to download. Default is root directory.
- `target`: The local directory (or file path) where files are saved. Default is current directory.

## Example

```yaml
steps:
  - uses: luxl/download-s3-with-endpoint@v0.2.0
    with:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      aws_region: us-east-1
      aws_bucket: ${{ secrets.AWS_BUCKET }}
      endpoint: 'https://s3.example.com'
      source: ''
      target: './backup'
```
