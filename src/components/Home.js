import React, { useState } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import AuthService from '../services/auth.service';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
      wrapper: {
         backgroundImage:"url('man3.jpg')",
         backgroundSize:'100%',
         backgroundPosition:'top, center',
         backgroundRepeat:'no-repeat',
      },
}));

function Home() {
   const classes = useStyles();

   let user = AuthService.getCurrentUser();
   return (
      <div className={classes.wrapper}>
         <Grid container maxwidth="xl" direction="row" justify="center" alignItems="center" style={{ marginBottom: '3rem' }}>
            <Grid item xs={10}>
               <Paper elevation={10} style={{ backgroundColor: 'rgba(30,30,30,0.5)', padding: '3rem', marginTop: '55%' }} align='center' >
                  <Typography variant="h1">NeoCities</Typography>
                  <blockquote>
                     <Typography variant="h5">If it's quick, easy money you want, you've come to the right place!</Typography>
                     <Typography variant="subtitle2" style={{ marginTop: '1rem' }}><i>"Alright alright alright"</i><br /></Typography>- Mark Hanna
                  </blockquote>
               </Paper>

               <Paper elevation={10} style={{ padding: '3rem', backgroundColor: 'white', color: '#262c2e' }}>
                  <Grid container justify="center">
                     <Grid item md={10}>
                        <Typography variant="h5">
                           Do you want to look as happy as this guy? Trade with NeoCities. Everybody who trades with us drives a Lambo. Unless they drive a Tesla.
                        Either way, they drive, and that's fantastic. Be fantastic. Be a Lambo. Be <i>NeoCities</i>.
                     </Typography>
                        <hr style={{ margin: '3rem 0' }} />
                        <Grid container spacing={3}>
                           <Grid item md={4}>
                              <Typography variant="body2">Deflector power at maximum. Energy discharge in six seconds. Warp reactor core primary coolant failure. Fluctuate phaser resonance frequencies. Resistance is futile. Recommend we adjust shield harmonics to the upper EM band when proceeding. These appear to be some kind of power-wave-guide conduits which allow them to work collectively as they perform ship functions. Increase deflector modulation to upper frequency band.</Typography>
                           </Grid>
                           <Grid item md={4}>
                              <Typography variant="body2">It indicates a synchronic distortion in the areas emanating triolic waves. The cerebellum, the cerebral cortex, the brain stem,  the entire nervous system has been depleted of electrochemical energy. Any device like that would produce high levels of triolic waves. These walls have undergone some kind of selective molecular polarization. I haven't determined if our phaser energy can generate a stable field. We could alter the photons with phase discriminators.</Typography>
                           </Grid>
                           <Grid item md={4}>
                              <Typography variant="body2">Unidentified vessel travelling at sub warp speed, bearing 235.7. Fluctuations in energy readings from it, Captain. All transporters off. A strange set-up, but I'd say the graviton generator is depolarized. The dark colourings of the scrapes are the leavings of natural rubber, a type of non-conductive sole used by researchers experimenting with electricity. The molecules must have been partly de-phased by the anyon beam.<br /><span><b>Neocities, 2022</b></span></Typography>
                           </Grid>
                        </Grid>
                     </Grid>
                  </Grid>
               </Paper>
            </Grid>
         </Grid>
      </div>
   );
}

export default Home;