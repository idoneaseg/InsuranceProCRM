import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import TableStyle from "../../components/TableStyle";
import Iconify from "../../components/iconify/Iconify";
import { apiget, deleteManyApi } from "../../service/api";
import DeleteModel from "../../components/Deletemodle";

// ----------------------- Custom Toolbar -----------------------
function CustomToolbar({ selectedRowIds, fetchdata }) {
  const [opendelete, setOpendelete] = useState(false);
  const [userAction, setUserAction] = useState(null);

  const handleCloseDelete = () => setOpendelete(false);
  const handleOpenDelete = () => setOpendelete(true);

  const deleteManyEmailTemplate = async (data) => {
    const result = await deleteManyApi("emailtemplate/deletemanny", data);
    fetchdata();
    setUserAction(result);
    handleCloseDelete();
  };

  useEffect(() => {
    setUserAction(userAction);
  }, [userAction]);

  return (
    <GridToolbarContainer>
      <GridToolbar />
      {selectedRowIds?.length > 0 && (
        <Button
          variant="text"
          sx={{ textTransform: "capitalize" }}
          startIcon={<DeleteOutline />}
          onClick={handleOpenDelete}
        >
          Delete
        </Button>
      )}
      <DeleteModel
        opendelete={opendelete}
        handleClosedelete={handleCloseDelete}
        deletedata={deleteManyEmailTemplate}
        id={selectedRowIds}
      />
    </GridToolbarContainer>
  );
}

CustomToolbar.propTypes = {
  selectedRowIds: PropTypes.array.isRequired,
  fetchdata: PropTypes.func.isRequired,
};

// ----------------------- Main Component -----------------------
const EmailTemplate = () => {
  const [designList, setDesignList] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const navigate = useNavigate();

  const userid = localStorage.getItem("user_id");
  const userRole = localStorage.getItem("userRole");

  const columns = [
    {
      field: "name",
      headerName: "Template Name",
      flex: 1,
      cellClassName: "name-column--cell name-column--cell--capitalize",
      renderCell: (params) => {
        const handleClick = () =>
          navigate(`/dashboard/emailtemplate/view/${params.row._id}`);
        return <Box onClick={handleClick}>{params.value}</Box>;
      },
    },
    {
      field: "createdOn",
      headerName: "Created On",
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      },
    },
    {
      field: "modifiedOn",
      headerName: "Modified On",
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      },
    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1,
      cellClassName: "name-column--cell name-column--cell--capitalize",
      renderCell: (params) => {
        const handleClick = () =>
          navigate(`/dashboard/user/view/${params?.row?.createdBy?._id}`);
        return (
          <Box onClick={handleClick}>
            {`${params.row.createdBy.firstName} ${params.row.createdBy.lastName}`}
          </Box>
        );
      },
    },
  ];

  const handleSelectionChange = (selectionModel) => {
    setSelectedRowIds(selectionModel);
  };

  const fetchdata = useCallback(async () => {
    const result = await apiget(
      userRole === "admin"
        ? `emailtemplate/list`
        : `emailtemplate/list/?createdBy=${userid}`
    );
    if (result && result.status === 200) {
      setDesignList(result.data.result);
    }
  }, [userRole, userid]);

  useEffect(() => {
    fetchdata();
  }, [fetchdata]); // ✅ fixed dependency warning

  return (
    <Container>
      <TableStyle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Email Template List</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            <Link
              to="/dashboard/emailtemplate/add"
              style={{ textDecoration: "none", color: "white" }}
            >
              New Template
            </Link>
          </Button>
        </Stack>

        <Box width="100%">
          <Card sx={{ height: "600px", pt: 2 }}>
            <DataGrid
              rows={designList}
              columns={columns}
              components={{
                Toolbar: () => (
                  <CustomToolbar
                    selectedRowIds={selectedRowIds}
                    fetchdata={fetchdata}
                  />
                ),
              }}
              checkboxSelection
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={selectedRowIds}
              getRowId={(row) => row._id}
            />
          </Card>
        </Box>
      </TableStyle>
    </Container>
  );
};

export default EmailTemplate;