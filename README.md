# Hog

The successor to pig.

### Development

To start the server / webpack in dev mode:

```
npm run dev
```

## Notes

Useful for testing uploads:
curl -i -F basicUpload=@../../Documents/wlt.md http://localhost:3000/upload

## Todo:

- production build (npm run deploy or something)
- see if there is a way to get real hotreloading happening

- Use webpack
-- to build css (use post css???)

- Websocket...
- Style it up
- Re-use vdom if possible
- Implement file uploader / progress / etc
- Implement file delete
- Implement file rename

