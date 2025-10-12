import {
  Box,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Actionbutton from "../../components/Actionbutton";
import Header from "../../components/Header";
import { apidelete, apiget } from "../../service/api";
import AddUser from "./Add";
import EditUser from "./Edit";
import DeleteModel from "../../components/Deletemodle";
import { CustomTabPanel, a11yProps } from "../../components/CustomTabPanel";
import Overview from "./Overview";
import Other from "./Other";

const View = () => {
  const [userDetails, setUserDetails] = useState({});
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [opendelete, setOpendelete] = useState(false);
  const [value, setValue] = useState(0);

  const navigate = useNavigate();
  const params = useParams();
  const userdata = JSON.parse(localStorage.getItem("user"));

  // --- Handlers ---
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const handleOpenDelete = () => setOpendelete(true);
  const handleCloseDelete = () => setOpendelete(false);

  const handleChange = (event, newValue) => setValue(newValue);

  const back = () => navigate("/dashboard/user");

  // --- Fetch user data ---
  const fetchdata = useCallback(async () => {
    const result = await apiget(`user/view/${params.id}`);
    if (result && result.status === 200) {
      setUserDetails(result.data);
    }
  }, [params.id]);

  // --- Delete user ---
  const deletedata = async () => {
    await apidelete(`user/delete/${params.id}`);
    navigate("/dashboard/user");
  };

  useEffect(() => {
    fetchdata();
  }, [fetchdata, openAdd]); // ✅ fixed exhaustive-deps warning

  return (
    <div>
      {/* Add User Modal */}
      <AddUser open={openAdd} handleClose={handleCloseAdd} />

      {/* Edit User Modal */}
      <EditUser
        open={openEdit}
        handleClose={handleCloseEdit}
        id={params.id}
        fetchUser={fetchdata}
      />

      {/* Delete User Modal */}
      <DeleteModel
        opendelete={opendelete}
        handleClosedelete={handleCloseDelete}
        deletedata={deletedata}
        id={params.id}
      />

      <Container>
        <Grid container display="flex" alignItems="center">
          <Stack
            direction="row"
            alignItems="center"
            mb={3}
            justifyContent="space-between"
            width="100%"
          >
            <Header
              title={`${userDetails?.firstName || ""} ${
                userDetails?.lastName || ""
              }`}
              subtitle="Profile Details"
            />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={2}
            >
              {userdata?.role === "admin" ? (
                <Actionbutton
                  handleOpen={handleOpenAdd}
                  handleOpenEdit={handleOpenEdit}
                  handleOpenDelete={handleOpenDelete}
                  back={back}
                />
              ) : (
                <Actionbutton
                  handleOpenEdit={handleOpenEdit}
                  handleOpenDelete={handleOpenDelete}
                  back={back}
                />
              )}
            </Stack>
          </Stack>
        </Grid>

        {/* Tabs */}
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              marginBottom: "0px",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="user details tabs"
            >
              <Tab label="OVERVIEW" {...a11yProps(0)} />
              <Tab label="OTHER" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <Overview data={userDetails} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Other data={userDetails} />
          </CustomTabPanel>
        </Box>
      </Container>
    </div>
  );
};

export default View;