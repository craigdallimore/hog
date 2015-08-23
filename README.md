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

## Client Structure

### Views

Each view provides a function from a model to VirtualDOM. Some views will have
access to a so-called `domEventBus`, to which all the DOM events are pushed.

### Streams

The critical stream is the state stream, which is intended to be a stream of the
entire client state. Other streams feed into this stream when dom / http / other
events occur, causing the stateStream to prduce a new state.

### Mappings

These are simple functions for taking a state object to a model, appropriate to
give to a view function.

### Effects

When the state is updated and mapped to a view, the DOM will be mutated to
present the new state of the view. This is arranged within 'effect' files,
providing a relationship between dom nodes, the state stream, mappings and
views.

## Notes

Useful for testing uploads:
curl -i -F basicUpload=@../../Documents/wlt.md http://localhost:3000/upload

## Todo:

- src/js/lib/files might be an effect
- Tidy up effect/uploadHTTP

- Enable streaming uploading from the client. Try to expose percentage.
- Style it up
- Re-use vdom if possible
- use es6 module syntax throughout server
- Implement file uploader / progress / etc
- Implement file delete
- Implement file rename
- Implement create directory

