# Hog

The successor to pig.

Useful for testing uploads:
curl -i -F basicUpload=@../../Documents/wlt.md http://localhost:3000/upload

Todo:

Serverside
- Put basic uploads into a directory based on mimetype

- Websocket...
- Use webpack
- Style it up
- Re-use vdom if possible
- Implement file uploader / progress / etc
- Implement file delete
- Implement file rename

user uploads a file
   V
fileReqresStream -----------------------------------\
 |                                                  |
 V                                                  |
fileStream -----------------------------\           |
    |                     |             |           |
    V                     V             V           |
fileNameStream      mimTypeStream  fileBufferStream |
    |                     |             |           |
    |                     V             |           |
    |               targetDirStream     |           |
    |                     |             |           |
    |                     V             |           |
    \--------------> filePathStream     |           |
                          |             |           |
                          V             |           |
                     writeStream <------/           |
                          |                         |
                                 <--- uploadResponseStream

Wow.
Ok, I think what we might want is a stream of the
first model update AFTER the writestream is donel

for each event from writeStream
wait until an event from fileSystemStream
then an event from model stream
then emit an event.

---------
clear
add bar
- writestream
- model
- addDir
- add
- model
add bar
- writestream
add foo
- writeStream
- add
- model

