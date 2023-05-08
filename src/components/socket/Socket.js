import SockJsClient from 'react-stomp';
import {getDomain} from 'helpers/getDomain';

const Socket = props => {

    const WEBSOCKET_SUFFIX = "/sopra-websocket"
    const WEBSOCKET_PREFIX= "/topic"

    return (
        <SockJsClient
            url={getDomain() + WEBSOCKET_SUFFIX}
            topics={[WEBSOCKET_PREFIX + props.topics]}
            onMessage={(msg) => props.onMessage(msg)}
        />
    );
}

export default Socket;