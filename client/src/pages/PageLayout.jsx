import { Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";

function PageLayout(){
    return(
        <Row >
            <Outlet></Outlet>
        </Row>
    )

}
export default PageLayout;