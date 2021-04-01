
import "../App.css";
import Story from "./Story";

const Sprint = ({props}) => {

    const SprintStories = ({stories}) => (
        <>
          {stories.map(story => (
            <Story props={story} key={stories.key}></Story>
          ))}
        </>
    ); 

    var storyList = [
        {name:'story1',key:'01'},
        {name:'story2',key:'02'}
    ];

  return (
    <div>
        <SprintStories stories={storyList} />
    </div>
  );
};
export default Sprint;
