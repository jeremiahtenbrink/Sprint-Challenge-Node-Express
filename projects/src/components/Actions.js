import React, { Component } from "react";
import api                  from "../api/api";
import {
    Accordion,
    Button,
    Form,
    Header,
    Icon,
    Input
}                           from "semantic-ui-react";

const style = {
    projectTitle: {
        display:        "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid lightgray"
    },
    deleteButton: {
        backgroundColor: "transparent",
        color: "red"
    }
};

class Actions extends Component {
    
    state = {
        actions:     [],
        activeIndex: 0,
        loading:     false,
    };
    
    handleClick = ( e, titleProps ) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        
        this.setState( { activeIndex: newIndex } );
    };
    
    componentDidMount() {
        api.get( `projects/${ this.props.id }` ).
            then( res => this.setState( { actions: res.data.actions } ) );
    };
    
    createAction = e => {
        this.setState( { loading: true } );
        
        let action = { project_id: this.props.id };
        
        for ( let i = 0; i < e.target.length; i++ ) {
            if ( e.target[ i ].name ) {
                action[ e.target[ i ].name ] = e.target[ i ].value;
            }
        }
        
        api.post( "/actions", action ).then( res => this.setState( state => {
            return {
                actions: [ ...state.actions, res.data ],
                loading: false
            };
        } ) );
        
    };
    
    deleteAction = id => {
        api.delete(`actions/${id}`)
            .then(res => this.setState(state => {
                return {
                    actions: state.actions.filter(action => action.id !== id )
                }
        })).catch(err => console.log(err));
    };
    
    render() {
        return (
            <Accordion>
                { this.state.actions.map( ( action, index ) => {
                    return (
                        <>
                            <Accordion.Title
                                active={ this.state.activeIndex === index }
                                index={ index } onClick={ this.handleClick }>
                                
                                <Header as={ "h3" }
                                        style={ style.projectTitle }>
                                    <div>
                                        <Icon name='dropdown'/>
                                        { action.description }
                                    </div>
                                    <Button style={ style.deleteButton } onClick={ () => this.deleteAction(action.id)}>
                                        Delete
                                    </Button>
                                </Header>
                            </Accordion.Title>
                            <Accordion.Content
                                active={ this.state.activeIndex === index }>
                                <p>
                                    { action.notes }
                                </p>
                            </Accordion.Content>
                        </>
                    );
                } ) }
                <Header as={ "h1" }>Create a new action</Header>
                <Form onSubmit={ this.createAction }>
                    <Form.Group>
                        <Form.Field name={ "description" }
                                    label={ "Description" } control={ Input }/>
                        <Form.Field name={ "notes" } label={ "notes" }
                                    control={ Input }/>
                    </Form.Group>
                    <Button type={ "submit" }
                            loading={ this.state.loading }>Submit</Button>
                </Form>
            </Accordion>
        );
    }
}

export default Actions;