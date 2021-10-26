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


class Ventas extends React.Component {
  state = {
    data: [],
    modalEditar: false,
    modalInsertar: false,
    form: {
      codigo: "",
      producto: "",
      precio: "",
    },
    id:0
  };
  peticionGet = () => {
    fireDb.child("ventas").on("value", (venta) => {
      if (venta.val() !== null) {
        this.setState({ ...this.state.data, data: venta.val() });
      } else {
        this.setState({ data: [] });
      }
    });
  };
  peticionPost=()=>{
    console.log(this.state.form)
    fireDb.child("ventas").push(this.state.form,
      error=>{
        if(error)console.log(error)
      });
      this.setState({modalInsertar: false});
  }
  peticionPut=()=>{
    fireDb.child(`ventas/${this.state.id}`).set(
      this.state.form,
      error=>{
        if(error)console.log(error)
      });
      this.setState({modalEditar: false});
  }
  peticionDelete=()=>{
    if(window.confirm(`Estás seguro que deseas eliminar la venta ${this.state.form && this.state.form.codigo}?`))
    {
    fireDb.child(`ventas/${this.state.id}`).remove(
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
  seleccionarVenta=async(venta,id,caso)=>{

    await this.setState({form: venta, id: id});

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
          <Button color="success" onClick={()=>this.setState({modalInsertar: true})}>Nueva venta</Button>
          <br />
          <br />
          <Table className="table table-bordered">
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
            {Object.keys(this.state.data).map(i => {
                return <tr key={i}>
                  
                  <td>{this.state.data[i].codigo}</td>
                  <td>{this.state.data[i].producto}</td>
                  <td>{this.state.data[i].precio}</td>
                  <td>
                    <Button color="primary" onClick={() => this.seleccionarVenta(this.state.data[i],i,'Editar')}>Editar</Button>{" "}
                    <Button color="danger" onClick={()=> this.seleccionarVenta(this.state.data[i],i,'Eliminar')}>Eliminar</Button>
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
                onChange={this.handleChange}
                value={this.state.form && this.state.form.codigo}
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
                value={this.state.form && this.state.form.producto}
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
                value={this.state.form && this.state.form.precio}
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
           <div><h3>Insertar Venta</h3></div>
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
export default Ventas;