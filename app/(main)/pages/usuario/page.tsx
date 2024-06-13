/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { UsuarioService } from '@/service/UsuarioService';
import { error } from 'console';


/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Usuario = () => {
    let usuarioVazio: Galeria.Usuario = {
        id: 0,
        nome: '',
        login: '',
        senha: '',
        email: ''
    };

    const [usuarios, setUsuarios] = useState<Galeria.Usuario[] | null>(null);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [usuario, setUsuario] = useState<Galeria.Usuario>(usuarioVazio);
    const [selectedUsuarios, setSelectedUsuarios] = useState<Galeria.Usuario[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const usuarioService = new UsuarioService();

    useEffect(() => {
        if(!usuarios){
        usuarioService.listarTodos().then((response)=> {
        console.log(response.data);
        setUsuarios(response.data);
       }).catch((error) => {
        console.log(error)
       }) 
        } 
    }, [usuarioService, usuarios]);



    const openNew = () => {
        setUsuario(usuarioVazio);
        setSubmitted(false);
        setUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUsuarioDialog(false);
    };

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const hideDeleteUsuariosDialog = () => {
        setDeleteUsuariosDialog(false);
    };

    const saveUsuario = () => {
        setSubmitted(true);

        if(!usuario.id){
            usuarioService.inserir(usuario)
            .then((response) => {
                console.log(response.data);
                setUsuarioDialog(false);
                setUsuario(usuarioVazio);
                setUsuarios(null);
                setUsuarios(response.data);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso!',
                    detail: 'Usuário cadastrado com sucesso!'
                })
            }).catch((error) =>{
                const errorMessage = error?.response?.data?.message || 'Erro ao salvar, tente novamente.';
                console.log(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: errorMessage
                })
            })
        }else{
            usuarioService.alterar(usuario)
            .then((response) => {
                setUsuarioDialog(false);
                setUsuario(usuarioVazio);
                setUsuarios(null);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso',
                    detail: 'Usuário alterado com sucesso.'
                })
            }).catch((error) => {
                const errorMessage = error?.response?.data?.message || 'Erro ao salvar, tente novamente.';
                console.log(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: errorMessage
                }) 
            })
        }
    };

    const editUsuario = (usuario: Galeria.Usuario) => {
        setUsuario({ ...usuario });
        setUsuarioDialog(true);
    };

    const confirmDeleteUsuario = (usuario: Galeria.Usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };

    const deleteUsuario = () => {
        if(usuario.id){
        usuarioService.excluir(usuario.id).then((response) => {
            setUsuario(usuarioVazio);
            setDeleteUsuarioDialog(false);
            setUsuarios(null);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Usuário deletado',
                life: 3000 });

        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao deletar',
                life: 3000 })
        })
    }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsuariosDialog(true);
    };

    const deleteSelectedUsuarios = () => {
        Promise.all(selectedUsuarios.map(async (_usuario) =>{
            if(_usuario.id){
            await usuarioService.excluir(_usuario.id);
    }
    })).then((response) => {
        setUsuarios(null);
        setSelectedUsuarios([]);
        setDeleteUsuariosDialog(false);
        toast.current?.show({
            severity: 'success',
            summary: 'Sucessso',
            detail: 'Deletado usuários.',
            life: 3000
        })
    }).catch((error) => {
        toast.current?.show({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Erro ao deletar usuários.',
            life: 3000
        })
    })
    };

    // const onCategoryChange = (e: RadioButtonChangeEvent) => {
    //     let _product = { ...product };
    //     _product['category'] = e.value;
    //     setProduct(_product);
    // };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, nome: string) => {
        const val = (e.target && e.target.value) || '';
        let _usuario = { ...usuario };
        _usuario[nome] = val;
    
        setUsuario(_usuario);
    };
    


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo Usuário" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsuarios || !(selectedUsuarios as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Galeria.Usuario) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Galeria.Usuario) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    };

    const loginBodyTemplate = (rowData: Galeria.Usuario) => {
        return (
            <>
                <span className="p-column-title">Login</span>
                {rowData.login}
            </>
        );
    };

    const emailBodyTemplate = (rowData: Galeria.Usuario) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };

    // const imageBodyTemplate = (rowData: Galeria.Usuario) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Imagem</span>
    //             <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
    //         </>
    //     );
    // };



    // const categoryBodyTemplate = (rowData: Demo.Product) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Category</span>
    //             {rowData.category}
    //         </>
    //     );
    // };


    // const statusBodyTemplate = (rowData: Demo.Product) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Status</span>
    //             <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
    //         </>
    //     );
    // };

    const actionBodyTemplate = (rowData: Galeria.Usuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUsuario(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Cadastro de Usuários</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const usuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveUsuario} />
        </>
    );
    const deleteUsuarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteUsuario} />
        </>
    );
    const deleteUsuariosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsuariosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedUsuarios} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={usuarios}
                        selection={selectedUsuarios}
                        onSelectionChange={(e) => setSelectedUsuarios(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} to {last} of {totalRecords} usuários"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum usuario encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
                       
                        {/* <Column field="category" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column> */}
                        
                        {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column> */}
                       
                        <Column field="login" header="Login" sortable body={loginBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
       
                       
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={usuarioDialog} style={{ width: '450px' }} header="Detalhes do Usuário" modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>
                        {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText
                                id="nome"
                                value={usuario.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.nome
                                })}
                            />
                            {submitted && !usuario.nome && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>
                        {/* <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={usuario.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div> */}

                        <div className="field">
                            <label htmlFor="login">Login</label>
                            <InputText
                                id="login"
                                value={usuario.login}
                                onChange={(e) => onInputChange(e, 'login')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.login
                                })}
                            />
                            {submitted && !usuario.login && <small className="p-invalid">Login é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="senha">Senha</label>
                            <InputText
                                id="senha"
                                value={usuario.senha}
                                onChange={(e) => onInputChange(e, 'senha')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.senha
                                })}
                            />
                            {submitted && !usuario.senha && <small className="p-invalid">Senha é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={usuario.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.email
                                })}
                            />
                            {submitted && !usuario.email && <small className="p-invalid">Email é obrigatório.</small>}
                        </div>

                        {/* <div className="field">
                            <label className="mb-3">Category</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
                                    <label htmlFor="category1">Accessories</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
                                    <label htmlFor="category2">Clothing</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
                                    <label htmlFor="category3">Electronics</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
                                    <label htmlFor="category4">Fitness</label>
                                </div>
                            </div> */}
                        {/* </div> */}

                       
                    </Dialog>

                    <Dialog visible={deleteUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && (
                                <span>
                                    Deseja realmente EXCLUIR o usuario? <b>{usuario.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuariosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuariosDialogFooter} onHide={hideDeleteUsuariosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>Deseja realmente EXCLUIR os usuarios selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Usuario;
