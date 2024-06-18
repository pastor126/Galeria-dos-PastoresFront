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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PerfilUsuarioService } from '@/service/PerfilUsuarioService';
import { error } from 'console';
import { UsuarioService } from '@/service/UsuarioService';
import { PerfilService } from '@/service/PerfilService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';



const PerfilUsuario = () => {
    let perfilUsuarioVazio: Galeria.PerfilUsuario = {
        id: 0,
        perfil: {descricao: ''},
        usuario: {nome: '', login: '', senha: '', email: ''}
    };

    const [perfisUsuario, setPerfisUsuario] = useState<Galeria.PerfilUsuario[] | null>(null);
    const [perfilUsuarioDialog, setPerfilUsuarioDialog] = useState(false);
    const [deletePerfilUsuarioDialog, setDeletePerfilUsuarioDialog] = useState(false);
    const [deletePerfilUsuariosDialog, setDeletePerfilUsuariosDialog] = useState(false);
    const [perfilUsuario, setPerfilUsuario] = useState<Galeria.PerfilUsuario>(perfilUsuarioVazio);
    const [selectedPerfilUsuarios, setSelectedPerfilUsuarios] = useState<Galeria.PerfilUsuario[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const perfilUsuarioService = useMemo(() => new PerfilUsuarioService(), []) ;
    const usuarioService = useMemo(()=> new UsuarioService(), []);
    const perfilService = useMemo(()=> new PerfilService(), []);
    const [usuarios, setUsuarios] = useState<Galeria.Usuario[]>([]);
    const [perfis, setPerfis] = useState<Galeria.Perfil[]>([]);

    useEffect(() => {
        if(!perfisUsuario){
        perfilUsuarioService.listarTodos()
        .then((response)=> {
        console.log(response.data);
        setPerfisUsuario(response.data);
       }).catch((error) => {
        console.log(error)
       }) 
        } 
    }, [perfilUsuarioService, perfisUsuario]);

    useEffect(() => {
        if(perfilUsuarioDialog){
            usuarioService.listarTodos()
            .then((response) => setUsuarios(response.data))
            .catch(error=> {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao carregar lista de usuarios.'
                });
            });
            perfilService.listarTodos()
            .then((response) => setPerfis(response.data))
            .catch(error => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao carregar lista de perfis.'
                }); 
            })
        }   
    }, [perfilUsuarioDialog, perfilService, usuarioService]);



    const openNew = () => {
        setPerfilUsuario(perfilUsuarioVazio);
        setSubmitted(false);
        setPerfilUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilUsuarioDialog(false);
    };

    const hideDeletePerfilUsuarioDialog = () => {
        setDeletePerfilUsuarioDialog(false);
    };

    const hideDeletePerfilUsuariosDialog = () => {
        setDeletePerfilUsuariosDialog(false);
    };

    const savePerfilUsuario = () => {
        setSubmitted(true);

        if(!perfilUsuario.id){
            perfilUsuarioService.inserir(perfilUsuario)
            .then((response) => {
                console.log(response.data);
                setPerfilUsuarioDialog(false);
                setPerfilUsuario(perfilUsuarioVazio);
                setPerfisUsuario(null);
                setPerfisUsuario(response.data);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso!',
                    detail: 'PerfilUsuario cadastrado com sucesso!'
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
            perfilUsuarioService.alterar(perfilUsuario)
            .then((response) => {
                setPerfilUsuarioDialog(false);
                setPerfilUsuario(perfilUsuarioVazio);
                setPerfisUsuario(null);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso',
                    detail: 'Perfil alterado com sucesso.'
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

    const editPerfilUsuario = (perfilUsuario: Galeria.PerfilUsuario) => {
        setPerfilUsuario({ ...perfilUsuario });
        setPerfilUsuarioDialog(true);
    };

    const confirmDeletePerfilUsuario = (perfilUsuario: Galeria.PerfilUsuario) => {
        setPerfilUsuario(perfilUsuario);
        setDeletePerfilUsuarioDialog(true);
    };

    const deletePerfilUsuario = () => {
        if(perfilUsuario.id){
        perfilUsuarioService.excluir(perfilUsuario.id).then((response) => {
            setPerfilUsuario(perfilUsuarioVazio);
            setDeletePerfilUsuarioDialog(false);
            setPerfisUsuario(null);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Perfil deletado',
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
        setDeletePerfilUsuariosDialog(true);
    };

    const deleteSelectedPerfilUsuarios = () => {
        Promise.all(selectedPerfilUsuarios.map(async (_perfilUsuario) =>{
            if(_perfilUsuario.id){
            await perfilUsuarioService.excluir(_perfilUsuario.id);
    }
    })).then((response) => {
        setPerfisUsuario(null);
        setSelectedPerfilUsuarios([]);
        setDeletePerfilUsuariosDialog(false);
        toast.current?.show({
            severity: 'success',
            summary: 'Sucessso',
            detail: 'Deletado perfis.',
            life: 3000
        })
    }).catch((error) => {
        toast.current?.show({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Erro ao deletar perfis.',
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
        let _perfilUsuario = { ...perfilUsuario };
        _perfilUsuario[nome] = val;
    
        setPerfilUsuario(_perfilUsuario);
    };
    


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo PerfilUsuario" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPerfilUsuarios || !(selectedPerfilUsuarios as any).length} />
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

    const idBodyTemplate = (rowData: Galeria.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const perfilBodyTemplate = (rowData: Galeria.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfil.descricao}
            </>
        );
    };

    const usuarioBodyTemplate = (rowData: Galeria.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Usuário</span>
                {rowData.usuario.nome}
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



    const actionBodyTemplate = (rowData: Galeria.PerfilUsuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfilUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfilUsuario(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Cadastro de PerfilUsuario</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const perfilUsuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={savePerfilUsuario} />
        </>
    );
    const deletePerfilUsuarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePerfilUsuario} />
        </>
    );
    const deletePerfilUsuariosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilUsuariosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPerfilUsuarios} />
        </>
    );

    const onSelectUsuariosChange = (usuario: Galeria.Usuario) =>{
        let _perfilUsuario = {...perfilUsuario};
        _perfilUsuario.usuario = usuario;
        setPerfilUsuario(_perfilUsuario);
    }

    const onSelectPerfilChange = (perfil: Galeria.Perfil) =>{
        let _perfilUsuario = {...perfilUsuario};
        _perfilUsuario.perfil = perfil;
        setPerfilUsuario(_perfilUsuario);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={perfisUsuario}
                        selection={selectedPerfilUsuarios}
                        onSelectionChange={(e) => setSelectedPerfilUsuarios(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} to {last} of {totalRecords} perfilUsuarios"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum PerfilUsuario encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="usuario" header="Usuário" sortable body={usuarioBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
                       
                        {/* <Column field="category" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column> */}
                        
                        {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column> */}
                                             
       
                       
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={perfilUsuarioDialog} style={{ width: '450px' }} header="Detalhes do perfilUsuario" modal className="p-fluid" footer={perfilUsuarioDialogFooter} onHide={hideDialog}>
                        {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                        <div className="field">
                            <label htmlFor="usuario">Usuário</label>
                            <Dropdown optionLabel='nome' value={perfilUsuario.usuario} options={usuarios} filter onChange={(e: DropdownChangeEvent) => onSelectUsuariosChange(e.value)} placeholder='Selecione um Usuário.'></Dropdown>
                        
                            {submitted && !perfilUsuario.usuario && <small className="p-invalid">O usuario é obrigatório.</small>}
                        </div>
                        
                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                            <Dropdown optionLabel='descricao' value={perfilUsuario.perfil} options={perfis} filter onChange={(e: DropdownChangeEvent) => onSelectPerfilChange(e.value)} placeholder='Selecione um perfil.'></Dropdown>

                            {submitted && !perfilUsuario.perfil && <small className="p-invalid">O perfil é obrigatório.</small>}
                        </div>
                        {/* <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={recurso.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div> */}

                    


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

                    <Dialog visible={deletePerfilUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilUsuarioDialogFooter} onHide={hideDeletePerfilUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilUsuario && (
                                <span>
                                    Deseja realmente EXCLUIR o perfilUsuario? <b>{perfilUsuario.usuario.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilUsuariosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilUsuariosDialogFooter} onHide={hideDeletePerfilUsuariosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilUsuario && <span>Deseja realmente EXCLUIR os perfis selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PerfilUsuario;
