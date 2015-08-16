# Hog

The successor to pig.

### Development

#### To start the server / webpack in dev mode:

```
npm run dev
```

This uses webpack-dev-server to host and rebuild frontend resources as they are
edited.

#### To build the production frontend resources:

```
npm run deploy
```

This will build new frontend resources once.

#### To start the production server

```
npm run prod
```

## Notes

Useful for testing uploads:
curl -i -F basicUpload=@../../Documents/wlt.md http://localhost:3000/upload

## Todo:

-- build minified etc
-- serve minified
- see if there is a way to get real hotreloading happening

- Use webpack
-- to build css (use post css???)

- Websocket...
- Style it up
- Re-use vdom if possible
- Implement file uploader / progress / etc
- Implement file delete
- Implement file rename

