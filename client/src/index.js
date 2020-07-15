import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = "http://localhost:3000/items"

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
          {tasks.map((item) => {
            return <Task key={item.id} task={item} onDelete={props.onDelete}/>
          })}
        </ul>
  )
}

const Task = (props) => {
  let task = props.task
  return (
    <div>
      <li>{task.description + "        "}
        <Button variant="danger" size="sm" onClick={()=> props.onDelete(task.id)}>X</Button><br/>
      </li>
    </div>
  )
}

class ToDoApp extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      tasks: []
    }
  }

  componentDidMount() {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
          this.setState({
            isLoaded: true,
            tasks: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  
  onTaskSubmit = (taskObj) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskObj)
    };
    fetch(BASE_URL, requestOptions)
    .then(response => response.json())
    .then(data => {
      let task = {
        description: data.description,
        complete: data.complete,
        id: data.id
      }
      let tasks = [...this.state.tasks, task];
      this.setState({
        tasks:tasks
      })
    })

  }




  onDelete = (taskID) => {
    const tasks = this.state.tasks
    const deleteOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch(`${BASE_URL}/${taskID}`, deleteOptions)
    .then((response) => {
      response.ok ? console.log('removed') : console.log("you fucked up")
      
      let result = tasks.filter(task => task.id !== taskID)
      this.setState({
        tasks: result
      })
      
    })
    .catch(error => {
      console.log(error)
    })
  }

  render() {
    
    const { error, isLoaded, tasks } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
    
    return (
      <div className="wrapper">
        <Card bg="info" style={{ width: '30rem' }}>
        
        
          <Header itemCount={tasks.length}/>
          <InputField onTaskSubmit={this.onTaskSubmit}/>
          <TaskList onDelete={this.onDelete} tasks={tasks}/>
        
        </Card>
      </div>
    )
  }  }
}


const rootElement = document.getElementById("root");
ReactDOM.render(<ToDoApp />, rootElement);


