import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import fireDb from "../firebase";
import MaterialTable from 'material-table';

import {
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";

import { forwardRef } from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';


const tableIcons = {
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

class Usuarios extends React.Component {
  state = {
    data: [],
    modalInsertar:false,
    modalEditar: false,
    form: {
      identificacion: "",
      apellido: "",
      nombre: "",
      correo:"",
    },
    id:0
    
  };
  
  peticionGet = () => {
    fireDb.child("usuarios").on("value", (usuario) => {
      if (usuario.val() !== null) {
        this.setState({ ...this.state.data, data: usuario.val() });
      } else {
        this.setState({ data: [] });
      }
    });
  };
  peticionPost=()=>{
    console.log(this.state.form)
    fireDb.child("usuarios").push(this.state.form,
      error=>{
        if(error)console.log(error)
      });
      this.setState({modalInsertar: false});
  }
  peticionPut=()=>{
    fireDb.child(`usuarios/${this.state.id}`).set(
      this.state.form,
      error=>{
        if(error)console.log(error)
      });
      this.setState({modalEditar: false});
  }
  peticionDelete=()=>{
    if(window.confirm(`Estás seguro que deseas eliminar el usuario ${this.state.form && this.state.form.identificacion}?`))
    {
    fireDb.child(`usuarios/${this.state.id}`).remove(
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
  seleccionarUsuario=async(usuario,caso)=>{

    await this.setState({form: usuario, id: usuario.id});

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
          <Button color="success" onClick={()=>this.setState({modalInsertar: true})}>Nuevo Usuario</Button>
          <br />
          <br />
          <MaterialTable
          columns={[
            { 
              title: "Identificacion", 
              field: "identificacion"
            },
            { 
              title: "Nombre",
              field: "nombre" 
            }, 
            {
              title: "Apellido",
              field: "apellido"
            },  
            {
              title: "Correo",
              field: "correo"
            },
            
          ]}

          data= {Object.keys(this.state.data).map(i => {
                return{
                  id:i,
                  identificacion:this.state.data[i].identificacion,
                  apellido:this.state.data[i].apellido,
                  nombre:this.state.data[i].nombre,
                  correo:this.state.data[i].correo
                }
              })}
              title="Lista de usuarios"
              icons={tableIcons}  
              actions={[
                {
                  icon: EditIcon,
                  tooltip: 'Editar usuario',
                  onClick: (event, rowData) => this.seleccionarUsuario(rowData, "Editar")
                },
                {
                  icon: DeleteIcon,
                  tooltip: 'Eliminar usuario',
                  onClick: (event, rowData) => this.seleccionarUsuario(rowData, "Eliminar")
                }
              ]}
            

              
              
                 // <td>
                   // <Button color="primary" onClick={() => this.seleccionarUsuario(this.state.data[i],i,'Editar')}>Editar</Button>{" "}
                    //<Button color="danger" onClick={()=> this.seleccionarUsuario(this.state.data[i],i,'Eliminar')}>Eliminar</Button>
                  //</td>

                //</tr>
               
              />
        </Container>

        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader>
           <div><h3>Editar Registro</h3></div>
          </ModalHeader>

          <ModalBody>
            
            <FormGroup>
              <label>
              Identificacion: 
              </label>
              <input
                className="form-control"
                name="identificacion"
                type="number"
                onChange={this.handleChange}
                value={this.state.form && this.state.form.identificacion}
                
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Apellido: 
              </label>
              <input
                className="form-control"
                name="apellido"
                type="text"
                onChange={this.handleChange}
                value={this.state.form && this.state.form.apellido}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Nombre: 
              </label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChange}
                value={this.state.form && this.state.form.nombre}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Correo: 
              </label>
              <input
                className="form-control"
                name="correo"
                type="text"
                onChange={this.handleChange}
                value={this.state.form && this.state.form.correo}
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
           <div><h3>Insertar Usuario</h3></div>
          </ModalHeader>

          <ModalBody>
            
            <FormGroup>
              <label>
              Identificacion: 
              </label>
              <input
                className="form-control"
                name="identificacion"
                type="number"
                onChange={this.handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Apellido: 
              </label>
              <input
                className="form-control"
                name="apellido"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>


            <FormGroup>
              <label>
                Nombre: 
              </label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Correo: 
              </label>
              <input
                className="form-control"
                name="correo"
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
export default Usuarios;