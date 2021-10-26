import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import fireDb from "../firebase"
import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";


class Productos extends React.Component {
  state = {
    data: [],
    modalEditar: false,
    modalInsertar: false,
    form: {
      codigo: "",
      producto: "",
      precio: "",
      descripcion: "",
    },
    id:0
  };
  peticionGet = () => {
    fireDb.child("productos").on("value", (producto) => {
      if (producto.val() !== null) {
        this.setState({ ...this.state.data, data: producto.val() });
      } else {
        this.setState({ data: [] });
      }
    });
  };
  peticionPost=()=>{
    console.log(this.state.form)
    fireDb.child("productos").push(this.state.form,
      error=>{
        if(error)console.log(error)
      });
      this.setState({modalInsertar: false});
  }
  peticionPut=()=>{
    fireDb.child(`productos/${this.state.id}`).set(
      this.state.form,
      error=>{
        if(error)console.log(error)
      });
      this.setState({modalEditar: false});
  }
  peticionDelete=()=>{
    if(window.confirm(`Estás seguro que deseas eliminar el producto ${this.state.form && this.state.form.codigo}?`))
    {
    fireDb.child(`productos/${this.state.id}`).remove(
      error=>{
        if(error)console.log(error)
      });
    }
  }
  handleChange=e=>{
    this.setState({form:{
      ...this.state.form,
      [e.target.name]: e.target.value
    }})
    console.log(this.state.form);
  }
  seleccionarProducto=async(producto,id,caso)=>{

    await this.setState({form: producto, id: id});

    (caso==="Editar")?this.setState({modalEditar: true}):
    this.peticionDelete()

  }
  componentDidMount(){
    this.peticionGet();
  }

  render() {
    
    return (
      <>
        <Container>
        <br />
          <Button color="success" onClick={()=>this.setState({modalInsertar: true})}>Nuevo Producto</Button>
          <br />
          <br />
          <Table className="table table-bordered">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Descripción</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
            {Object.keys(this.state.data).map(i => {
                return <tr key={i}>
                  
                  <td>{this.state.data[i].codigo}</td>
                  <td>{this.state.data[i].producto}</td>
                  <td>{this.state.data[i].precio}</td>
                  <td>{this.state.data[i].descripcion}</td>
                  <td>
                    <Button color="primary" onClick={() => this.seleccionarProducto(this.state.data[i],i,'Editar')}>Editar</Button>{" "}
                    <Button color="danger" onClick={()=> this.seleccionarProducto(this.state.data[i],i,'Eliminar')}>Eliminar</Button>
                  </td>

                </tr>
               })}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader>
           <div><h3>Editar Registro</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
               Codigo:
              </label>
            
              <input
                className="form-control"
                name="codigo"
                type="number"
                value={this.state.form && this.state.form.codigo}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                producto: 
              </label>
              <input
                className="form-control"
                name="producto"
                type="text"
                onChange={this.handleChange}
                value={this.state.form && this.state.form.producto}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                precio: 
              </label>
              <input
                className="form-control"
                name="precio"
                type="number"
                onChange={this.handleChange}
                value={this.state.form && this.state.form.precio}
              />
            </FormGroup>

            <FormGroup>
              <label>
                descripción: 
              </label>
              <input
                className="form-control"
                name="descripcion"
                type="text"
                onChange={this.handleChange}
                value={this.state.form && this.state.form.descripcion}
              />
            </FormGroup>

          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.peticionPut()}
            >
              Editar
            </Button>
            <Button
              color="danger"
              onClick={() => this.setState({modalEditar: false})}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>



        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
           <div><h3>Insertar Producto</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
                Codigo: 
              </label>
              
              <input
                className="form-control"
                name="codigo"
                type="number"
                onChange={this.handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Producto: 
              </label>
              <input
                className="form-control"
                name="producto"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Precio: 
              </label>
              <input
                className="form-control"
                name="precio"
                type="number"
                onChange={this.handleChange}
              />
            </FormGroup>


            <FormGroup>
              <label>
                Descripción: 
              </label>
              <input
                className="form-control"
                name="descripcion"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.peticionPost()}
            >
              Insertar
            </Button>
            <Button
              className="btn btn-danger"
              onClick={() => this.setState({modalInsertar: false})}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
export default Productos;