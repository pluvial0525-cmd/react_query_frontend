import React, { useMemo, useState } from 'react'
import { useAllGetProduct, useDeleteProduct, usePostRegisterProduct, usePutUpdateProduct } from '../../no3_store/hooks/useProduct'
import { AgGridReact } from 'ag-grid-react';
import ProductModal from './ProductModal';
import styled from 'styled-components';

const ProductTable = () => {
    const [open, setOpen] = useState(false);
    const [newProduct, setNewProduct] = useState(null);
    const { data: productList = [], isLoading, error } = useAllGetProduct();
    const registerMutation = usePostRegisterProduct()
    const updataMutation = usePutUpdateProduct();
    const deleteMutation = useDeleteProduct();

    const handleRegister = () => {
        setNewProduct(null)
        setOpen(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm("선택한 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            await deleteMutation.mutateAsync(id)
        }
    }

    const handleUpdate = (item) => {
        setNewProduct(item)
        setOpen(true)
    }

    const columnDefs = useMemo(() => ([
        { field: "product_name", headerName: "상품명", flex: 1.3, minWidth: 160 },
        { field: "color", headerName: "색상", flex: 0.9, minWidth: 100 },
        { 
            field: "cost_price", 
            headerName: "원가", 
            flex: 1, 
            minWidth: 120,
            valueFormatter: params => params.value ? `₩${Number(params.value).toLocaleString()}` : '₩0'
        },
        { 
            field: "sale_price", 
            headerName: "판매가", 
            flex: 1, 
            minWidth: 120,
            valueFormatter: params => params.value ? `₩${Number(params.value).toLocaleString()}` : '₩0'
        },
        { field: "category_code", headerName: "카테고리 코드", flex: 1, minWidth: 130 },
        { 
            headerName: "관리",
            cellRenderer: (params) => (
                <ActionContainer>
                    <EditButton onClick={() => handleUpdate(params.data)}>수정</EditButton>
                    <DeleteButton onClick={() => handleDelete(params.data.id)}>삭제</DeleteButton>
                </ActionContainer>
            ),
            flex: 1.1,
            minWidth: 150
        },
    ]), [handleDelete, handleUpdate])

    if (isLoading) return <StatusMessage $type="loading">데이터 로드 중...</StatusMessage>
    if (error) return <StatusMessage $type="error">데이터를 불러오지 못했습니다 ({error?.message})</StatusMessage>

    return (
        <Container>
            {/* 세련된 상단 인클로저 구도 */}
            <Header>
                <TitleSection>
                    <MainTitle>상품 통합 관리</MainTitle>
                    <SubTitle>전체 상품 목록을 조회하고 실시간으로 관리합니다.</SubTitle>
                </TitleSection>
                <RegisterButton onClick={handleRegister}>상품 등록</RegisterButton>
            </Header>

            {/* 깔끔하게 떨어지는 그리드 프레임 */}
            <GridSection className='ag-theme-quartz'>
                <AgGridReact
                    rowData={productList}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={15}
                    paginationPageSizeSelector={[]}
                    animateRows={true}
                    getRowId={(params) => params.data.id.toString()}
                    rowHeight={50}
                />
            </GridSection>

            {/* 모달 바인딩 */}
            <ProductModal
                open={open}
                setOpen={setOpen}
                initialValues={newProduct}
                onSubmit={async (productObj) => {
                    if (newProduct) {
                        await updataMutation.mutateAsync({ ...productObj, id: newProduct.id })
                    } else {
                        await registerMutation.mutateAsync(productObj)
                    }
                }}
            />
        </Container>
    )
}

export default ProductTable;


/* 💅 깔끔하고 신뢰감을 주는 모던 대시보드 스펙 스타일 */

const Container = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef2f6;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
  padding: 32px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MainTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.3px;
`;

const SubTitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: #64748b;
`;

const RegisterButton = styled.button`
  padding: 10px 18px;
  background-color: #4f46e5; /* 세련된 딥 인디고 블루 */
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4338ca;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const GridSection = styled.div`
  height: 640px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;

  /* AG Grid 라이트 모드 깔끔한 테마 주입 */
  --ag-background-color: #ffffff;
  --ag-header-background-color: #f8fafc;
  --ag-header-foreground-color: #475569;
  --ag-foreground-color: #1e293b;
  --ag-border-color: #f1f5f9;
  --ag-row-hover-color: #f8fafc;
  --ag-selected-row-background-color: #e0e7ff;
  --ag-font-size: 14px;
  
  .ag-header-cell-label {
    font-weight: 600;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  height: 100%;
`;

const ActionButton = styled.button`
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
`;

const EditButton = styled(ActionButton)`
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;

  &:hover {
    background-color: #e2e8f0;
    color: #0f172a;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #fff1f2;
  color: #df1c1c;
  border: 1px solid #ffe4e6;

  &:hover {
    background-color: #ffe4e6;
    color: #b91c1c;
  }
`;

const StatusMessage = styled.div`
  padding: 60px;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: ${props => props.$type === 'error' ? '#ef4444' : '#64748b'};
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef2f6;
`;