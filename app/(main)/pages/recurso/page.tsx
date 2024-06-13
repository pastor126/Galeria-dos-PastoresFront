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
import { RecursoService } from '@/service/RecursoService';
import { error } from 'console';


/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Recurso = () => {
    let recursoVazio: Galeria.Recurso = {
        id: 0,
        nome: '',
        chave: ''
    };

    const [recursos, setRecursos] = useState<Galeria.Recurso[]>([]);
    const [recursoDialog, setRecursoDialog] = useState(false);
    const [deleteRecursoDialog, setDeleteRecursoDialog] = useState(false);
    const [deleteRecursosDialog, setDeleteRecursosDialog] = useState(false);
    const [recurso, setRecurso] = useState<Galeria.Recurso>(recursoVazio);
    const [selectedRecursos, setSelectedRecursos] = useState<Galeria.Recurso[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const recursoService = new RecursoService();

    useEffect(() => {
        if(recursos.length == 0){
        recursoService.listarTodos().then((response)=> {
        console.log(response.data);
        setRecursos(response.data);
       }).catch((error) => {
        console.log(error)
       }) 
        } 
    }, [recursoService, recursos]);



    const openNew = () => {
        setRecurso(recursoVazio);
        setSubmitted(false);
        setRecursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRecursoDialog(false);
    };

    const hideDeleteRecursoDialog = () => {
        setDeleteRecursoDialog(false);
    };

    const hideDeleteRecursosDialog = () => {
        setDeleteRecursosDialog(false);
    };

    const saveRecurso = () => {
        setSubmitted(true);

        if(!recurso.id){
            recursoService.inserir(recurso)
            .then((response) => {
                console.log(response.data);
                setRecursoDialog(false);
                setRecurso(recursoVazio);
                setRecursos([]);
                setRecursos(response.data);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso!',
                    detail: 'Recurso cadastrado com sucesso!'
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
            recursoService.alterar(recurso)
            .then((response) => {
                setRecursoDialog(false);
                setRecurso(recursoVazio);
                setRecursos([]);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso',
                    detail: 'Recurso alterado com sucesso.'
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

    const editRecurso = (recurso: Galeria.Recurso) => {
        setRecurso({ ...recurso });
        setRecursoDialog(true);
    };

    const confirmDeleteRecurso = (recurso: Galeria.Recurso) => {
        setRecurso(recurso);
        setDeleteRecursoDialog(true);
    };

    const deleteRecurso = () => {
        if(recurso.id){
        recursoService.excluir(recurso.id).then((response) => {
            setRecurso(recursoVazio);
            setDeleteRecursoDialog(false);
            setRecursos([]);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Recurso deletado',
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
        setDeleteRecursosDialog(true);
    };

    const deleteSelectedRecursos = () => {
        Promise.all(selectedRecursos.map(async (_recurso) =>{
            if(_recurso.id){
            await recursoService.excluir(_recurso.id);
    }
    })).then((response) => {
        setRecursos([]);
        setSelectedRecursos([]);
        setDeleteRecursosDialog(false);
        toast.current?.show({
            severity: 'success',
            summary: 'Sucessso',
            detail: 'Deletado recursos.',
            life: 3000
        })
    }).catch((error) => {
        toast.current?.show({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Erro ao deletar recursos.',
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
        let _recurso = { ...recurso };
        _recurso[nome] = val;
    
        setRecurso(_recurso);
    };
    


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo Recurso" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRecursos || !(selectedRecursos as any).length} />
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

    const idBodyTemplate = (rowData: Galeria.Recurso) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Galeria.Recurso) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    };

    const chaveBodyTemplate = (rowData: Galeria.Recurso) => {
        return (
            <>
                <span className="p-column-title">Chave</span>
                {rowData.chave}
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



    const actionBodyTemplate = (rowData: Galeria.Recurso) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editRecurso(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteRecurso(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Cadastro de Recursos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const recursoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveRecurso} />
        </>
    );
    const deleteRecursoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteRecursoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteRecurso} />
        </>
    );
    const deleteRecursosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteRecursosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedRecursos} />
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
                        value={recursos}
                        selection={selectedRecursos}
                        onSelectionChange={(e) => setSelectedRecursos(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} to {last} of {totalRecords} recursos"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum Recurso encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
                       
                        {/* <Column field="category" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column> */}
                        
                        {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column> */}
                       
                        <Column field="chave" header="Chave" sortable body={chaveBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                       
       
                       
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={recursoDialog} style={{ width: '450px' }} header="Detalhes do Recurso" modal className="p-fluid" footer={recursoDialogFooter} onHide={hideDialog}>
                        {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText
                                id="nome"
                                value={recurso.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !recurso.nome
                                })}
                            />
                            {submitted && !recurso.nome && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>
                        {/* <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={recurso.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div> */}

                        <div className="field">
                            <label htmlFor="chave">Chave</label>
                            <InputText
                                id="chave"
                                value={recurso.chave}
                                onChange={(e) => onInputChange(e, 'chave')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !recurso.chave
                                })}
                            />
                            {submitted && !recurso.chave && <small className="p-invalid">chave é obrigatório.</small>}
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

                    <Dialog visible={deleteRecursoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteRecursoDialogFooter} onHide={hideDeleteRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {recurso && (
                                <span>
                                    Deseja realmente EXCLUIR o recurso? <b>{recurso.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRecursosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteRecursosDialogFooter} onHide={hideDeleteRecursosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {recurso && <span>Deseja realmente EXCLUIR os recursos selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Recurso;
