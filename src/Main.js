import React from "react";

class Main extends React.Component {

    render() {
        //const key = this.props.match.params.keys;
        const {history} = this.props;
        //console.log(this.props.location.pathname);
        if(this.props.location.pathname !== "/nest/"){
            history.push("/nest/")
        }else{
            if(sessionStorage.getItem("authUserNo")){
                history.push("/nest/dashboard")
            }else{
                history.push("/nest/login")
            }
        }
        return (<></>);
    }
}
export default Main;