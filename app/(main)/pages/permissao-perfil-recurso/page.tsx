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
import { PermissaoPerfilRecursoService } from '@/service/PermissaoPerfilRecursoService';
import { error } from 'console';
import { RecursoService } from '@/service/RecursoService';
import { PerfilService } from '@/service/PerfilService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';



const PerfilRecurso = () => {
    let perfilRecursoVazio: Galeria.PermissaoPerfilRecurso = {
        id: 0,
        perfil: {descricao: ''},
        recurso: {nome: '', chave: ''}
    };

    const [perfisRecurso, setPerfisRecurso] = useState<Galeria.PermissaoPerfilRecurso[] | null>(null);
    const [perfilRecursoDialog, setPerfilRecursoDialog] = useState(false);
    const [deletePerfilRecursoDialog, setDeletePerfilRecursoDialog] = useState(false);
    const [deletePerfilRecursosDialog, setDeletePerfilRecursosDialog] = useState(false);
    const [perfilRecurso, setPerfilRecurso] = useState<Galeria.PermissaoPerfilRecurso>(perfilRecursoVazio);
    const [selectedPerfilRecursos, setSelectedPerfilRecursos] = useState<Galeria.PermissaoPerfilRecurso[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const perfilRecursoService = useMemo(() => new PermissaoPerfilRecursoService(), []) ;
    const recursoService = useMemo(()=> new RecursoService(), []);
    const perfilService = useMemo(()=> new PerfilService(), []);
    const [recursos, setRecursos] = useState<Galeria.Recurso[]>([]);
    const [perfis, setPerfis] = useState<Galeria.Perfil[]>([]);

    useEffect(() => {
        if(!perfisRecurso){
        perfilRecursoService.listarTodos()
        .then((response)=> {
        console.log(response.data);
        setPerfisRecurso(response.data);
       }).catch((error) => {
        console.log(error)
       }) 
        } 
    }, [perfilRecursoService, perfisRecurso]);

    useEffect(() => {
        if(perfilRecursoDialog){
            recursoService.listarTodos()
            .then((response) => setRecursos(response.data))
            .catch(error=> {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao carregar lista de recursos.'
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
    }, [perfilRecursoDialog, perfilService, recursoService]);



    const openNew = () => {
        setPerfilRecurso(perfilRecursoVazio);
        setSubmitted(false);
        setPerfilRecursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilRecursoDialog(false);
    };

    const hideDeletePerfilRecursoDialog = () => {
        setDeletePerfilRecursoDialog(false);
    };

    const hideDeletePerfilRecursosDialog = () => {
        setDeletePerfilRecursosDialog(false);
    };

    const savePerfilRecurso = () => {
        setSubmitted(true);

        if(!perfilRecurso.id){
            perfilRecursoService.inserir(perfilRecurso)
            .then((response) => {
                console.log(response.data);
                setPerfilRecursoDialog(false);
                setPerfilRecurso(perfilRecursoVazio);
                setPerfisRecurso(null);
                setPerfisRecurso(response.data);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso!',
                    detail: 'PerfilRecurso cadastrado com sucesso!'
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
            perfilRecursoService.alterar(perfilRecurso)
            .then((response) => {
                setPerfilRecursoDialog(false);
                setPerfilRecurso(perfilRecursoVazio);
                setPerfisRecurso(null);
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

    const editPerfilRecurso = (perfilRecurso: Galeria.PermissaoPerfilRecurso) => {
        setPerfilRecurso({ ...perfilRecurso });
        setPerfilRecursoDialog(true);
    };

    const confirmDeletePerfilRecurso = (perfilRecurso: Galeria.PermissaoPerfilRecurso) => {
        setPerfilRecurso(perfilRecurso);
        setDeletePerfilRecursoDialog(true);
    };

    const deletePerfilRecurso = () => {
        if(perfilRecurso.id){
        perfilRecursoService.excluir(perfilRecurso.id).then((response) => {
            setPerfilRecurso(perfilRecursoVazio);
            setDeletePerfilRecursoDialog(false);
            setPerfisRecurso(null);
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
        setDeletePerfilRecursosDialog(true);
    };

    const deleteSelectedPerfilRecursos = () => {
        Promise.all(selectedPerfilRecursos.map(async (_perfilRecurso) =>{
            if(_perfilRecurso.id){
            await perfilRecursoService.excluir(_perfilRecurso.id);
    }
    })).then((response) => {
        setPerfisRecurso(null);
        setSelectedPerfilRecursos([]);
        setDeletePerfilRecursosDialog(false);
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
        let _perfilRecurso = { ...perfilRecurso };
        _perfilRecurso[nome] = val;
    
        setPerfilRecurso(_perfilRecurso);
    };
    


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nova Permissão" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPerfilRecursos || !(selectedPerfilRecursos as any).length} />
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

    const idBodyTemplate = (rowData: Galeria.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const perfilBodyTemplate = (rowData: Galeria.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfil.descricao}
            </>
        );
    };

    const recursoBodyTemplate = (rowData: Galeria.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Recurso</span>
                {rowData.recurso.nome}
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



    const actionBodyTemplate = (rowData: Galeria.PermissaoPerfilRecurso) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfilRecurso(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfilRecurso(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Cadastro de Permissões por perfil.</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const perfilRecursoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={savePerfilRecurso} />
        </>
    );
    const deletePerfilRecursoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilRecursoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePerfilRecurso} />
        </>
    );
    const deletePerfilRecursosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilRecursosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPerfilRecursos} />
        </>
    );

    const onSelectRecursosChange = (recurso: Galeria.Recurso) =>{
        let _perfilRecurso = {...perfilRecurso};
        _perfilRecurso.recurso = recurso;
        setPerfilRecurso(_perfilRecurso);
    }

    const onSelectPerfilChange = (perfil: Galeria.Perfil) =>{
        let _perfilRecurso = {...perfilRecurso};
        _perfilRecurso.perfil = perfil;
        setPerfilRecurso(_perfilRecurso);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={perfisRecurso}
                        selection={selectedPerfilRecursos}
                        onSelectionChange={(e) => setSelectedPerfilRecursos(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} to {last} of {totalRecords} perfilRecursos"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum Perfil/Recurso encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="recurso" header="Recurso" sortable body={recursoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
                       
                        {/* <Column field="category" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column> */}
                        
                        {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column> */}
                                             
       
                       
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={perfilRecursoDialog} style={{ width: '450px' }} header="Detalhes do perfilRecurso" modal className="p-fluid" footer={perfilRecursoDialogFooter} onHide={hideDialog}>
                        {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                            <Dropdown optionLabel='descricao' value={perfilRecurso.perfil} options={perfis} filter onChange={(e: DropdownChangeEvent) => onSelectPerfilChange(e.value)} placeholder='Selecione um perfil.'></Dropdown>

                            {submitted && !perfilRecurso.perfil && <small className="p-invalid">O perfil é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="recurso">Recurso</label>
                            <Dropdown optionLabel='nome' value={perfilRecurso.recurso} options={recursos} filter onChange={(e: DropdownChangeEvent) => onSelectRecursosChange(e.value)} placeholder='Selecione um Recurso.'></Dropdown>
                        
                            {submitted && !perfilRecurso.recurso && <small className="p-invalid">O recurso é obrigatório.</small>}
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

                    <Dialog visible={deletePerfilRecursoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilRecursoDialogFooter} onHide={hideDeletePerfilRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilRecurso && (
                                <span>
                                    Deseja realmente EXCLUIR o Perfil/Recurso? <b>{perfilRecurso.recurso.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilRecursosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilRecursosDialogFooter} onHide={hideDeletePerfilRecursosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilRecurso && <span>Deseja realmente EXCLUIR os perfis selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PerfilRecurso;
