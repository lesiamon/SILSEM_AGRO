import React, { useState, useEffect, useRef } from "react";
import {AppBar,Toolbar,Typography,Card,CardContent,CardMedia,Button,CircularProgress,Grid,IconButton,Fade,Box,useTheme}
from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { CloudUpload, Cancel, Info } from "@material-ui/icons";
import axios from "axios";
import image from "./bg.png";
import { makeStyles } from "@material-ui/core/styles";

// ------------------- STYLES -------------------
const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "linear-gradient(45deg, #2c5364 30%, #203a43 90%)",
    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
  },
  title: {
    flexGrow: 1,
    fontWeight: 700,
    letterSpacing: 1.2,
  },
  mainContainer: {
    padding: theme.spacing(4),
    minHeight: "100vh",
    background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardGrid: {
    width: "90%",
    maxWidth: 1400,
    margin: "0 auto",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  card: {
    backdropFilter: "blur(12px)",
    backgroundColor: "rgba(255, 255, 255, 0.93)!important",
    borderRadius: 20,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.25)",
    },
  },
  previewImage: {
    height: 400,
    objectFit: "cover",
    borderRadius: 16,
    border: "2px solid rgba(255, 255, 255, 0.3)",
  },
  resultCard: {
    height: 400,
    overflow: "auto",
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  confidenceText: {
    color: theme.palette.success.main,
    fontWeight: 800,
    fontSize: "1.4rem",
    marginTop: theme.spacing(1),
  },
  gptFeedback: {
    background: "linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)",
    borderRadius: 10,
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    maxHeight: 280,
    overflowY: "auto",
    border: "1px solid #e2e8f0",
  },
  clearButton: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2, 5),
    borderRadius: 30,
    fontWeight: 700,
    fontSize: "1rem",
    background: "linear-gradient(45deg, #2c5364 30%, #203a43 90%)",
    color: "white",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  dropzone: {
    minHeight: 300,
    border: "2px dashed rgba(44, 83, 100, 0.3)!important",
    borderRadius: 16,
    "&:hover": {
      borderColor: "#2c5364!important",
    },
  },
  resultTitle: {
    fontWeight: 700,
    color: "#2c5364",
    marginBottom: theme.spacing(2),
  },
  scrollContainer: {
    overflowX: "auto",
    display: "flex",
    flexWrap: "nowrap",
    gap: theme.spacing(2),
    margin: theme.spacing(4, 0),
    paddingBottom: theme.spacing(2),
  },
  scrollItem: {
    minWidth: 250,
    minHeight: 350,
    backdropFilter: "blur(12px)",
    backgroundColor: "rgba(255, 255, 255, 0.93)!important",
    borderRadius: 20,
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    padding: theme.spacing(3),
    flex: "0 0 auto",
  },
  tallCard: {
    minHeight: 250,
  },
  eventImage: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: theme.spacing(2),
  },
  mediaContainer: {
    position: 'relative',
    height: '80vh',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: { // Mobile styles
      height: '20vh',
      width: '100%',
      margin: '0 auto'
    },
  },
  mediaItem: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'none',
    '&.active': {
      display: 'block',
    },
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    [theme.breakpoints.down('sm')]: {
      objectFit: 'contain', // Show full image on mobile
    },
  },
  footer: {
    textAlign: "center",
    marginTop: theme.spacing(5),
    padding: theme.spacing(2),
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 8,
    width: "90%",
    maxWidth: 1400,
  },
}));

// ------------------- FORMATTED FEEDBACK COMPONENT -------------------
const FormattedFeedback = ({ text }) => {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <Box textAlign="left" style={{ lineHeight: 1.6, fontSize: "0.88rem", color: "#2d3748" }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <Box key={idx} style={{ height: 6 }} />;
        }
        if (trimmed.startsWith("### ")) {
          return (
            <Typography key={idx} variant="subtitle2" style={{ fontWeight: 800, color: "#1a365d", marginTop: 8, marginBottom: 4 }}>
              {trimmed.replace("### ", "")}
            </Typography>
          );
        }
        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return (
            <Typography key={idx} variant="body2" style={{ fontWeight: 700, color: "#2c5282", marginTop: 6, marginBottom: 2 }}>
              {trimmed.replace(/\*\*/g, "")}
            </Typography>
          );
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <Typography key={idx} variant="body2" style={{ marginLeft: 8, marginBottom: 3, display: "flex", alignItems: "flex-start", fontSize: "0.85rem" }}>
              <span style={{ marginRight: 6, color: "#3182ce" }}>•</span>
              <span>{trimmed.substring(2).replace(/\*\*(.*?)\*\*/g, "$1")}</span>
            </Typography>
          );
        }
        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <Typography key={idx} variant="body2" style={{ marginLeft: 8, marginBottom: 3, fontSize: "0.85rem" }}>
              {trimmed.replace(/\*\*(.*?)\*\*/g, "$1")}
            </Typography>
          );
        }
        return (
          <Typography key={idx} variant="body2" style={{ marginBottom: 4, fontSize: "0.85rem" }}>
            {trimmed.replace(/\*\*(.*?)\*\*/g, "$1")}
          </Typography>
        );
      })}
    </Box>
  );
};

// ------------------- COMPONENT -------------------
export const ImageUpload = () => {
  const classes = useStyles();
  const theme = useTheme();

  // State
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef(null);

  // Media items array (can mix images and videos)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mediaItems = [
    { type: 'image', url: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F994876233%2F2028150665093%2F1%2Foriginal.20250328-081851?crop=focalpoint&fit=crop&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.5&fp-y=0.5&s=6896291043a631aa16a9d75bc3235d6a', alt: 'Farming Event' },
    /*{ type: 'iframe', embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/nk8Eqh3KBYw?autoplay=1&mute=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    alt: 'Farming Tutorial' },*/
    { type: 'image', url: 'https://cdn-az.allevents.in/events5/banners/1c1064827f655af8e552e20ad77b8ed74362e3f3df80b80aae9f613b1dd6c856-rimg-w1200-h675-dc2e4616-gmir.jpg?v=1723165183', alt: 'Farm Equipment', searchQuery: 'modern+farm+equipment' },
    // Add more items as needed
    
  ];

  // Handle auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      if (mediaItems[activeIndex].type !== 'video' || 
          (videoRef.current && videoRef.current.ended)) {
        setActiveIndex((prev) => (prev + 1) % mediaItems.length);
      }
    }, 5000); // 5 seconds

    return () => clearInterval(timer);
  }, [activeIndex, mediaItems]);

  // Handle video end
  const handleVideoEnd = () => {
    setActiveIndex((prev) => (prev + 1) % mediaItems.length);
  };

  // Handle file selection
  const onSelectFile = (files) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setErrorMessage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      sendFile(file);
    }
  };

  // Send file to backend
  const sendFile = async (file) => {
    setIsLoading(true);
    setErrorMessage(null);
    let formData = new FormData();
    formData.append("file", file);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000/predict";
      console.log("Uploading file to:", apiUrl);
      
      let response = await axios.post(
        apiUrl,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 45000,
        }
      );
      
      console.log("Upload successful:", response.data);
      if (response.status === 200 && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("File upload failed:", error);
      const errMsg = error.response?.data?.error || error.message || "Failed to analyze leaf image. Ensure backend is running.";
      setErrorMessage(errMsg);
    }
    setIsLoading(false);
  };

  // Clear results
  const clearData = () => {
    setSelectedFile(null);
    setPreview(null);
    setData(null);
    setErrorMessage(null);
  };

  return (
    <div>
      {/* Top App Bar */}
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            🌱 SILSEM Agro Analytics
          </Typography>
          <IconButton color="inherit">
            <Info style={{ fontSize: 28 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Container */}
      <div className={classes.mainContainer}>
        <Grid container spacing={4} className={classes.cardGrid}>
          {/* Upload Card */}
          <Grid item xs={12} md={4}>
            <Card className={classes.card}>
              <CardContent>
                {!selectedFile ? (
                  <DropzoneArea
                    acceptedFiles={["image/*"]}
                    dropzoneText={
                      <Box textAlign="center" p={2}>
                        <CloudUpload style={{ fontSize: 48, color: "#2c5364" }} />
                        <Typography variant="h6" style={{ marginTop: 16 }}>
                          Drag & Drop or Click to Upload
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{ marginTop: 8 }}
                        >
                          Supported formats: JPEG, PNG
                        </Typography>
                      </Box>
                    }
                    onChange={onSelectFile}
                    filesLimit={1}
                    showAlerts={false}
                    classes={{ root: classes.dropzone }}
                  />
                ) : (
                  <Fade in={true}>
                    <CardMedia
                      component="img"
                      className={classes.previewImage}
                      image={preview}
                      alt="Uploaded Plant"
                    />
                  </Fade>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Results Card */}
          <Grid item xs={12} md={4}>
            <Card className={`${classes.card} ${classes.resultCard}`}>
              {isLoading ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <CircularProgress size={60} style={{ color: "#2c5364" }} />
                  <Typography variant="body2" style={{ marginTop: 16, color: "#666" }}>
                    Analyzing leaf pathology...
                  </Typography>
                </Box>
              ) : errorMessage ? (
                <Box textAlign="center" p={2} my="auto">
                  <Typography variant="h6" color="error" gutterBottom>
                    Analysis Failed
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {errorMessage}
                  </Typography>
                </Box>
              ) : data ? (
                <Fade in={true}>
                  <Box textAlign="center" pt={1}>
                    <Typography variant="h5" className={classes.resultTitle}>
                      Diagnosis & Confidence
                    </Typography>
                    <Box
                      my={2}
                      py={1}
                      px={2.5}
                      borderRadius={16}
                      style={{
                        backgroundColor:
                          data.class === "Healthy"
                            ? "#e8f5e9"
                            : data.class === "Late Blight"
                            ? "#ffebee"
                            : "#fff3e0",
                        display: "inline-block",
                        border: `1.5px solid ${
                          data.class === "Healthy"
                            ? "#4caf50"
                            : data.class === "Late Blight"
                            ? "#e53935"
                            : "#fb8c00"
                        }`
                      }}
                    >
                      <Typography
                        variant="h5"
                        style={{
                          fontWeight: 700,
                          color:
                            data.class === "Healthy"
                              ? "#2e7d32"
                              : data.class === "Late Blight"
                              ? "#c62828"
                              : "#ef6c00",
                        }}
                      >
                        {data.class}
                      </Typography>
                    </Box>
                    <Typography className={classes.confidenceText}>
                      Confidence: {(data.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Fade>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography variant="h6" style={{ color: theme.palette.text.secondary }}>
                    Diagnosis & Confidence
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>

          {/* AI Recommendations Card */}
          <Grid item xs={12} md={4}>
            <Card className={`${classes.card} ${classes.resultCard}`}>
              {isLoading ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <CircularProgress size={40} style={{ color: "#2c5364" }} />
                  <Typography variant="body2" style={{ marginTop: 12, color: "#666" }}>
                    Generating advisory guidance...
                  </Typography>
                </Box>
              ) : data?.ai_feedback ? (
                <Fade in={true}>
                  <div>
                    <Typography variant="h5" className={classes.resultTitle}>
                      🌱 AI Recommendations
                    </Typography>
                    <div className={classes.gptFeedback}>
                      <FormattedFeedback text={data.ai_feedback} />
                    </div>
                  </div>
                </Fade>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography variant="h6" style={{ color: theme.palette.text.secondary }}>
                    AI Recommendations
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Clear Results Button */}
        {data && (
          <Button
            variant="contained"
            className={classes.clearButton}
            onClick={clearData}
            startIcon={<Cancel style={{ fontSize: 28 }} />}
          >
            Clear Results
          </Button>
        )}
        {/* Fungicides Sections */}
        <Typography
          variant="h4"
          style={{
            margin: "20px 0 10px 0",
            color: "#fff",
            textAlign: "center",
            fontWeight: 600
          }}
        >
          Upcoming Events.
        </Typography>

        {/* Media Slideshow Card */}
        <Grid container spacing={2} className={classes.cardGrid}>
          <Grid item xs={12}>
            <Card className={`${classes.card} ${classes.tallCard}`}>
              <CardContent>
                <div className={classes.mediaContainer}>
                  {mediaItems.map((item, index) => (
                    <div 
                      key={index}
                      className={`${classes.mediaItem} ${index === activeIndex ? 'active' : ''}`}
                    >
                      {item.type === 'image' ? (
                        <CardMedia
                          component="img"
                          className={classes.videoPlayer}
                          image={item.url}
                          alt={item.alt}
                        />
                      ) : (
                        <video
                          ref={index === activeIndex ? videoRef : null}
                          className={classes.videoPlayer}
                          controls
                          onEnded={handleVideoEnd}
                        >
                          <source src={item.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  ))}
                </div>

                <Typography variant="body2" color="textSecondary">
                  {/* Your additional text here */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Fungicides Sections */}
        <Typography
          variant="h4"
          style={{
            margin: "20px 0 10px 0",
            color: "#fff",
            textAlign: "center",
            fontWeight: 600
          }}
        >
          Early blight Fungicides
        </Typography>

        <div className={classes.cardGrid}>
          <div className={classes.scrollContainer}>
            {/* Early Blight Fungicides */}
            {[
              {
                name: "Azoxystrobin",
                image: "https://www.albaugh.com/images/unitedstateslibraries/productimages/seed-treatment/albaugh_1gal_azoxystrobin100st.png?sfvrsn=7114137e_1",
                ingredients: "Azoxystrobin",
                mode: "Systemic",
                manufacturer: "Sygenta"
              },
              {
                name: "Difenoconazole",
                image: "https://www.bestagrolife.com/img/d-zole.webp",
                ingredients: "Difenoconazole",
                mode: "Systemic",
                manufacturer: "Corteva"
              },
              {
                name: "Mancozeb",
                image: "https://aljayplantingdreams.com/wp-content/uploads/2017/04/Mancozeb-web.png",
                ingredients: "Mancozeb",
                mode: "Contact",
                manufacturer: "BASF"
              },
              {
                name: "Copper Hydroxide",
                image: "https://www.grosafe.co.nz/wp-content/uploads/2022/05/Hortcare-Copper-Hydroxide-10kg-Bag.png",
                ingredients: "Copper Hydroxide",
                mode: "Contact",
                manufacturer: "Syngenta"
              },
              {
                name: "Chlorothalonil",
                image: "https://www.controlsolutionsinc.com/hs-fs/hubfs/jug_Chlorothalonil720F_EN_2022.png?width=560&height=703&name=jug_Chlorothalonil720F_EN_2022.png",
                ingredients: "Chlorothalonil",
                mode: "Contact",
                manufacturer: "Syngenta"
              }
            ].map((item, index) => (
              <div key={index} className={classes.scrollItem}>
                <CardMedia
                  component="img"
                  className={classes.eventImage}
                  image={item.image}
                  alt={item.name}
                />
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Active ingredients: {item.ingredients}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Mode of action: {item.mode}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Manufacturer: {item.manufacturer}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        <Typography
          variant="h4"
          style={{
            margin: "20px 0 10px 0",
            color: "#fff",
            textAlign: "center",
            fontWeight: 600
          }}
        >
          Late blight Fungicides
        </Typography>
        
        <div className={classes.cardGrid}>
          <div className={classes.scrollContainer}>
            {/* Late Blight Fungicides */}
            {[
              {
                name: "Metalaxyl + Mancozeb",
                image: "https://image.made-in-china.com/202f0j00PCyodNbWGsqG/Fungicide-Metalaxyl-M-Mancozeb-68-Wg-for-Downy-Phytophthora.webp",
                ingredients: "Metalaxyl, Mancozeb",
                mode: "Systemic & Contact",
                manufacturer: "FMC"
              },
              {
                name: "Fluopicolide + Propamocarb",
                image: "https://www.unkrautvernichter-shop.de/images/product_images/popup_images/Infinito-1-Liter-Propamocarb-Fluopicolide_461.jpg",
                ingredients: "Fluopicolide, Propamocarb",
                mode: "Systemic",
                manufacturer: "Bayer"
              },
              {
                name: "Cymoxanil + Mancozeb",
                image: "https://5.imimg.com/data5/SELLER/Default/2021/5/FX/MO/EQ/96410225/cymoxanil-8-mancozeb-64-wp.png",
                ingredients: "Cymoxanil, Mancozeb",
                mode: "Systemic & Contact",
                manufacturer: "Adama"
              },
              {
                name: "Mandipropamid",
                image: "https://5.imimg.com/data5/DF/XL/EU/GLADMIN-115669/revus-mandipropamid-25-sc-fungicide.jpg",
                ingredients: "Mandipropamid",
                mode: "Systemic",
                manufacturer: "Syngenta"
              },
              {
                name: "Dimethomorph",
                image: "https://cdn.globalso.com/tangagri/Dimethomorph-2.png",
                ingredients: "Dimethomorph",
                mode: "Systemic",
                manufacturer: "BASF"
              }
            ].map((item, index) => (
              <div key={index} className={classes.scrollItem}>
                <CardMedia
                  component="img"
                  className={classes.eventImage}
                  image={item.image}
                  alt={item.name}
                />
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Active ingredients: {item.ingredients}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Mode of action: {item.mode}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Manufacturer: {item.manufacturer}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Lime Farms. All rights reserved.
          </Typography>
        </footer>
      </div>
    </div>
  );
};