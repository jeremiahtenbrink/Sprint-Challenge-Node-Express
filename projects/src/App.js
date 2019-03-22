import React, { Component } from 'react';
import logo                 from './logo.svg';
import './App.css';
import {
  Container,
  Segment,
  Accordion,
  Breadcrumb,
  Icon, Form, Input, Button, Header
} from "semantic-ui-react";
import api                  from "./api/api";
import Actions              from "./components/Actions";



class App extends Component {
  
  state  = {
    breadcrumb: [{key: 'Home', content: 'Home', link: true}],
    activeIndex: 0,
    projects: [],
    loading: false,
  };
  
  componentDidMount() {
    api.get("/projects")
        .then(res => {
          debugger;
          this.setState({projects: res.data})
    })
        .catch(err => {
          debugger;
          console.log(err)
    });
  }
  
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    
    this.setState({ activeIndex: newIndex })
  };
  
  createProject = e => {
    this.setState({loading: true});
    
    let project = {};
    
    for(let i = 0; i < e.target.length; i++){
      if (e.target[i].name){
        project[e.target[i].name] = e.target[i].value;
      }
    }
    
    api.post('/projects', project)
        .then(res =>  this.setState(state => {
          return {
            projects: [...state.projects, res.data],
            loading: false
          }
    }))
    
  };
  
  render() {
    return (
      <Container>
        <Breadcrumb icon='right angle' sections={this.state.breadcrumb} />
        <Segment>
          <Accordion>
            {this.state.projects.map((project, index) => {
              return (
                  <>
                  <Accordion.Title active={this.state.activeIndex === index} index={index} onClick={this.handleClick}>
                    <Header as={"h1"}>
                      <Icon name='dropdown' />
                      {project.name}
                    </Header>
                  </Accordion.Title>
                  <Accordion.Content active={this.state.activeIndex === index}>
                    <Header as={"h3"}>
                      {project.description}
                    </Header>
                    <Actions id={project.id}/>
                  </Accordion.Content>
                  </>
              )
            })}
            <Header as={"h1"}>Create a new project</Header>
            <Form onSubmit={this.createProject}>
              <Form.Group>
                <Form.Field name={"name"} label={"Name"} control={Input}/>
                <Form.Field name={"description"} label={"Description"} control={Input}/>
              </Form.Group>
              <Button type={"submit"} loading={this.state.loading}>Submit</Button>
            </Form>
            
          </Accordion>
        </Segment>
      </Container>
    );
  }
}

export default App;
