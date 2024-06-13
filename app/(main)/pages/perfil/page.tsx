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
import { PerfilService } from '@/service/PerfilService';
import { error } from 'console';


/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Perfil = () => {
    let perfilVazio: Galeria.Perfil = {
        id: 0,
        descricao: ''
    };

    const [perfis, setPerfis] = useState<Galeria.Perfil[] | null>(null);
    const [perfilDialog, setPerfilDialog] = useState(false);
    const [deletePerfilDialog, setDeletePerfilDialog] = useState(false);
    const [deletePerfilsDialog, setDeletePerfilsDialog] = useState(false);
    const [perfil, setPerfil] = useState<Galeria.Perfil>(perfilVazio);
    const [selectedPerfils, setSelectedPerfils] = useState<Galeria.Perfil[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const perfilService = new PerfilService();

    useEffect(() => {
        if(!perfis){
        perfilService.listarTodos()
        .then((response)=> {
        console.log(response.data);
        setPerfis(response.data);
       }).catch((error) => {
        console.log(error)
       }) 
        } 
    }, [perfilService, perfis]);



    const openNew = () => {
        setPerfil(perfilVazio);
        setSubmitted(false);
        setPerfilDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilDialog(false);
    };

    const hideDeletePerfilDialog = () => {
        setDeletePerfilDialog(false);
    };

    const hideDeletePerfilsDialog = () => {
        setDeletePerfilsDialog(false);
    };

    const savePerfil = () => {
        setSubmitted(true);

        if(!perfil.id){
            perfilService.inserir(perfil)
            .then((response) => {
                console.log(response.data);
                setPerfilDialog(false);
                setPerfil(perfilVazio);
                setPerfis(null);
                setPerfis(response.data);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso!',
                    detail: 'Perfil cadastrado com sucesso!'
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
            perfilService.alterar(perfil)
            .then((response) => {
                setPerfilDialog(false);
                setPerfil(perfilVazio);
                setPerfis(null);
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

    const editPerfil = (perfil: Galeria.Perfil) => {
        setPerfil({ ...perfil });
        setPerfilDialog(true);
    };

    const confirmDeletePerfil = (perfil: Galeria.Perfil) => {
        setPerfil(perfil);
        setDeletePerfilDialog(true);
    };

    const deletePerfil = () => {
        if(perfil.id){
        perfilService.excluir(perfil.id).then((response) => {
            setPerfil(perfilVazio);
            setDeletePerfilDialog(false);
            setPerfis(null);
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
        setDeletePerfilsDialog(true);
    };

    const deleteSelectedPerfils = () => {
        Promise.all(selectedPerfils.map(async (_perfil) =>{
            if(_perfil.id){
            await perfilService.excluir(_perfil.id);
    }
    })).then((response) => {
        setPerfis(null);
        setSelectedPerfils([]);
        setDeletePerfilsDialog(false);
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
        let _perfil = { ...perfil };
        _perfil[nome] = val;
    
        setPerfil(_perfil);
    };
    


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo Perfil" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPerfils || !(selectedPerfils as any).length} />
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

    const idBodyTemplate = (rowData: Galeria.Perfil) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const descricaoBodyTemplate = (rowData: Galeria.Perfil) => {
        return (
            <>
                <span className="p-column-title">Descrição</span>
                {rowData.descricao}
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



    const actionBodyTemplate = (rowData: Galeria.Perfil) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfil(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfil(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Cadastro de Perfil</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const perfilDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={savePerfil} />
        </>
    );
    const deletePerfilDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePerfil} />
        </>
    );
    const deletePerfilsDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilsDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPerfils} />
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
                        value={perfis}
                        selection={selectedPerfils}
                        onSelectionChange={(e) => setSelectedPerfils(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} to {last} of {totalRecords} perfils"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum Perfil encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="descricao" header="Descrição" sortable body={descricaoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
                       
                        {/* <Column field="category" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column> */}
                        
                        {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column> */}
                                             
       
                       
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={perfilDialog} style={{ width: '450px' }} header="Detalhes do perfil" modal className="p-fluid" footer={perfilDialogFooter} onHide={hideDialog}>
                        {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                        <div className="field">
                            <label htmlFor="descricao">Descrição</label>
                            <InputText
                                id="descricao"
                                value={perfil.descricao}
                                onChange={(e) => onInputChange(e, 'descricao')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !perfil.descricao
                                })}
                            />
                            {submitted && !perfil.descricao && <small className="p-invalid">A descrição é obrigatória.</small>}
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

                    <Dialog visible={deletePerfilDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilDialogFooter} onHide={hideDeletePerfilDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfil && (
                                <span>
                                    Deseja realmente EXCLUIR o perfil? <b>{perfil.descricao}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilsDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilsDialogFooter} onHide={hideDeletePerfilsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfil && <span>Deseja realmente EXCLUIR os perfis selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
