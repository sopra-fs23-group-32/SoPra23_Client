
import BaseContainer from "components/ui/BaseContainer";
import Table from "./Table";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";


const HistoryPage = (props) => {
    const history = useHistory();
    var list = [
        { id: 1, date: '12/1/2011', correct: 3, wrong:4},
        { id: 2, date: '13/1/2011', correct: 3, wrong:4},
        { id: 3, date: '13/1/2011', correct: 3, wrong:4}
    ];

    
  return (
    <BaseContainer className="profile container">
      <div>History</div>
      <div>
      <Table data={list} />
    </div>
    <div className="profile button-container">
        <Button width="300%"
          onClick={() => {
            localStorage.removeItem("profileId");
            history.push("/home");
          }}
        >
          Return to Home
        </Button>
        </div>    
    </BaseContainer>
  );
};

export default HistoryPage;
