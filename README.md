# Hog

The successor to pig.

### Development

#### To start the server / webpack in dev mode:

```
npm run dev
```

This uses webpack-dev-server to host and rebuild frontend resources as they are
edited.

### Production

#### To build the production frontend resources:

```
npm run build
```

#### To start the production server

```
npm run prod
```

## Notes

Useful for testing uploads:
curl -i -F basicUpload=@../../Documents/wlt.md http://localhost:3000/upload

## Todo:

- Tidy up.
- Enable streaming uploading from the client. Try to expose percentage.
- Style it up
- Re-use vdom if possible
- use es6 module syntax throughout server
- Implement file uploader / progress / etc
- Implement file delete
- Implement file rename

