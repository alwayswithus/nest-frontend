import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'

class CustomEvent {
    customEventService(event){
        let popoverClickRootClose = (
            <Popover id="popover-trigger-click-root-close" style={{ zIndex: 10000 }}>
                <strong>Holy guacamole!</strong> Check this info.
            </Popover>
        );

        return (
            <div className="CustomEvent">
                <OverlayTrigger id="help" trigger="click" rootClose placement="top" overlay={popoverClickRootClose}>
                    <div>{event.title}</div>
                </OverlayTrigger>
            </div>
        )
    }
}

export default new CustomEvent();