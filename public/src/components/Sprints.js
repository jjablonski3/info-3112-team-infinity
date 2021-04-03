
import "../App.css";
import Stories from "./Stories";

const Sprints = ({props}) => {

    const SprintStories = ({stories}) => (
        <>
          {stories.map((story, keyIndex) => (
            <Stories props={story} key={keyIndex}></Stories>
          ))}
        </>
    ); 

    var storyList = [
        {name:'story1',key:'01'}
    ];

    //<SprintStories stories={storyList} />
  return (
    <div>
        <Stories props={{sprintId: 9000}}></Stories>
    </div>
  );
};
export default Sprints;
