/* eslint-disable arrow-body-style */
import {
  Box,
  Button,
  Container,
  FormLabel,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState, useCallback } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate, useParams } from "react-router-dom";
import { EmailEditor } from "react-email-editor";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import { apidelete, apiget, apiput } from "../../service/api";
import DeleteModel from "../../components/Deletemodle";

const View = () => {
  const emailEditorRef = useRef(null);
  const [preview, setPreview] = useState(false);
  const [opendelete, setOpendelete] = useState(false);
  const [design, setDesign] = useState({});
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  const handleOpenDelete = () => setOpendelete(true);
  const handleCloseDelete = () => setOpendelete(false);

  const saveDesign = () => {
    if (!name.trim()) {
      toast.error("Template Name is required");
      return;
    }

    emailEditorRef.current?.exportHtml(async ({ html, design }) => {
      const data = { html, design, name, modifiedOn: new Date() };
      const result = await apiput(`emailtemplate/edit/${params.id}`, data);

      if (result && result.status === 200) {
        toast.success("Template updated successfully!");
        navigate("/dashboard/emailtemplate");
      }
    });
  };

  const togglePreview = () => {
    if (preview) {
      emailEditorRef.current?.editor?.hidePreview();
    } else {
      emailEditorRef.current?.editor?.showPreview("desktop");
    }
    setPreview((prev) => !prev);
  };

  const onLoad = () => {
    if (design) {
      emailEditorRef.current?.editor?.loadDesign(design);
    }
  };

  const fetchData = useCallback(async () => {
    const result = await apiget(`emailtemplate/view/${params.id}`);
    if (result?.status === 200) {
      setDesign(result.data.emailtemplate.design);
      setName(result.data.emailtemplate.name);
    }
  }, [params.id]);

  const remove = async () => {
    await apidelete(`emailtemplate/delete/${params.id}`);
    navigate("/dashboard/emailtemplate");
  };

  const back = () => navigate("/dashboard/emailtemplate");

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <DeleteModel
        opendelete={opendelete}
        handleClosedelete={handleCloseDelete}
        deletedata={remove}
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
            <Header title="View & Edit Template" />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={togglePreview}
              >
                {preview ? "Hide Preview" : "Show Preview"}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={saveDesign}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleOpenDelete}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ArrowBackIosIcon />}
                onClick={back}
              >
                Back
              </Button>
            </Stack>
          </Stack>
        </Grid>

        <FormLabel>Template Name</FormLabel>
        <TextField
          size="small"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Box height="680px" bgcolor="gray" className="editerHeight" mt={1}>
          <EmailEditor ref={emailEditorRef} onLoad={onLoad} />
        </Box>
      </Container>
    </div>
  );
};

export default View;