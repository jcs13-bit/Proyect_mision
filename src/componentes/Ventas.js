import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import fireDb from "../firebase"
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
  seleccionarVenta=async(venta,caso)=>{

    await this.setState({form: venta, id: venta.id});

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
          <MaterialTable
          columns={[
            { 
              title: "Código", 
              field: "codigo"
            },
            { 
              title: "Producto",
              field: "producto" 
            }, 
            {
              title: "Precio",
              field: "precio"
            },  
            
            
          ]}

          data={Object.keys(this.state.data).map(i => {
                return {
                  id:i,
                  codigo:this.state.data[i].codigo,
                  producto:this.state.data[i].producto,
                  precio:this.state.data[i].precio
                }
              })}
              title="Lista de ventas"
              icons={tableIcons}  
              actions={[
                {
                  icon: EditIcon,
                  tooltip: 'Editar usuario',
                  onClick: (event, rowData) => this.seleccionarVenta(rowData, "Editar")
                },
                {
                  icon: DeleteIcon,
                  tooltip: 'Eliminar usuario',
                  onClick: (event, rowData) => this.seleccionarVenta(rowData, "Eliminar")
                }
              ]}
            
            />

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