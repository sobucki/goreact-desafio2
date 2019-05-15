import React, { Component } from 'react';
import moment from 'moment';
import { Container, Form } from './styles';
import CompareList from '../../components/CompareList';
import api from '../../services/api';

import logo from '../../assets/logo.png';

export default class Main extends Component {
  state = {
    loading: false,
    repositoryInput: '',
    repositories: [],
    repositoryError: false,
  };

  constructor(props) {
    super(props);
    this.state = { repositories: JSON.parse(localStorage.getItem('valor')) || [] };
  }

  handleAddRepository = async (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    try {
      const { data: repository } = await api.get(`/repos/${this.state.repositoryInput}`);

      repository.lastCommit = moment(repository.pushed_at).fromNow();
      const teste = [...this.state.repositories, repository];
      console.log(teste);
      localStorage.setItem('valor', JSON.stringify(teste));

      this.setState({
        repositoryInput: '',
        repositories: [...this.state.repositories, repository],
        repositoryError: false,
      });
    } catch (error) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form withError={this.state.repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={this.state.repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">
            {this.state.loading ? <i className="fa fa-spinner fa-pulse" /> : 'Ok'}
          </button>
        </Form>
        <CompareList repositories={this.state.repositories} />
      </Container>
    );
  }
}
