//// IMPORT ///////////////////////////////////////////////////////////////////

import toHTML from 'vdom-to-html';
import page from '../../src/js/views/page';

//// EXPORT ///////////////////////////////////////////////////////////////////

//  :: Object library -> String HTML
export const libraryToHTML = library => `<!doctype html>${toHTML(page(library))}`;

///////////////////////////////////////////////////////////////////////////////
