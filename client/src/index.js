import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Card from 'react-bootstrap/Card'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

//const sampleList = [
//  {description: "Wash the car", complete:false},
//  {description: "Feed the cat", complete:false},
//  {description: "Order pizza for the bois", complete:false},
//  {description: "Cancel plans with the bois", complete:false},
//]

const BASE_URL = "http://localhost:3000/api"

const Header = (props) => {
  let count = props.itemCount
  return (
    <Card.Header bg="info" as="h1">You have {count} tasks</Card.Header>
  )
}

const InputField = (props) => {
  const [description, setDescription] = useState("")

  const validateTask = () => {
    return description.length > 0 
  }

  const handleSubmit = event => {
    event.preventDefault()
    let taskObj = {
        description: description,
        complete: false
    }
    console.log(taskObj)
    props.onTaskSubmit(taskObj)
    setDescription("")
  }

  return (
    <Form  onSubmit={handleSubmit}>
      <Form.Row className="align-items-center">
      <Col sm={10} >
      
        
        <Form.Control 
              size="large"
              placeholder="Enter a new task description"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
      </Col>
      <Col >
        <Button disabled={!validateTask()} type="submit">Add!</Button>
      </Col>
      </Form.Row>
    </Form>






  )
}

const TaskList = (props) => {
  let tasks = props.tasks
  return (
    
      <ul >
          {tasks.map((item, index) => {
            return <Task key={index} id={index} task={item} onDelete={props.onDelete}/>
          })}
        </ul>
    
  )
}

const Task = (props) => {
  let task = props.task
  
  return (
    <div>
    <li>{task.description + "        "}
    <Button variant="danger" size="sm" onClick={()=> props.onDelete(props.id)}>x</Button><br/>
   
    </li>
    </div>
  )
}

class ToDoApp extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      tasks: []
    }
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  
  onTaskSubmit = (taskObj) => {
    let tasks = [...this.state.tasks, taskObj]
    console.log(tasks)
    this.setState({
      tasks: tasks
    });
  }

  onDelete = (index) => {
    const arrCopy = [...this.state.tasks];
    arrCopy.splice(index, 1);
    this.setState({tasks: arrCopy});
}
  
  render() {
    const list = this.state.tasks
    return (
      <div className="wrapper">
        <Card bg="info" style={{ width: '30rem' }}>
        
        
          <Header itemCount={list.length}/>
          <InputField onTaskSubmit={this.onTaskSubmit}/>
          <TaskList onDelete={this.onDelete} tasks={list}/>
        
        </Card>
      </div>
    )
  }  
}


const rootElement = document.getElementById("root");
ReactDOM.render(<ToDoApp />, rootElement);


