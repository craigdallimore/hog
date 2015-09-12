///////////////////////////////////////////////////////////////////////////////
//
// Upload drag target
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import { DRAG_OVER, DRAG_ENTER, DRAG_LEAVE, DROP } from '../../../constants';
import h from 'virtual-dom/h';
import classnames from 'classnames';
import { domEventBus } from '../streams/domEvent';
import { compose } from 'ramda';

//// HELPERS //////////////////////////////////////////////////////////////////

// :: Event -> Event
const preventDefault = e => {
  e.preventDefault();
  return e;
};

// :: Event -> Object
const handleDragEnter = () => ({ event : DRAG_ENTER });
const handleDragLeave = () => ({ event : DRAG_LEAVE });
const handleDragOver  = () => ({ event : DRAG_OVER });
const handleDrop = e => ({ event: DROP, files : e._rawEvent.dataTransfer.files })

// :: Event -> undefined
const pushToStream = e => domEventBus.push(e);

//// COMPONENT ////////////////////////////////////////////////////////////////

// Object model -> Virtual DOM
const modelToVDOM = model => {

  let className = classnames('drag-target', {
    'drag-target--hover' : model.isOver
  });

  return h('section',
    {
      className,
      'ev-dragenter' : compose(pushToStream, handleDragEnter, preventDefault),
      'ev-dragleave' : compose(pushToStream, handleDragLeave, preventDefault),
      'ev-dragover'  : compose(pushToStream, handleDragOver, preventDefault),
      'ev-drop'      : compose(pushToStream, handleDrop, preventDefault)
    },
    [
      h('h2', 'Drop files here')
    ]
  );

};

//// EXPORTS //////////////////////////////////////////////////////////////////

export default modelToVDOM;

///////////////////////////////////////////////////////////////////////////////
