import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { Score } from '../../model/score';
import { AppDataHelper } from '../../services/appDataHelper';

export interface StageUIProps {
	score: Score | null;
}

export const StageUI = ({ score }: StageUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			width: '21cm',
			height: '100%',
			textAlign: 'center',
			backgroundColor: '#fff',
			//backgroundImage: 'linear-gradient(135deg, #fff 47.06%, #ccc 47.06%, #ccc 50%, #fff 50%, #fff 97.06%, #ccc 97.06%, #ccc 100%)',
			//backgroundSize: '24px 24px',
			//padding: '2.54cm 1.32cm 3.67cm 1.9cm',
			opacity: 0.85,
			overflow: 'auto',
			'@media print': {
				//padding: '0',
				opacity: 1,
				overflow: 'visible',
			},
		},
		content: {
			backgroundColor: '#fff',
			color: '#000',
		},
		stageHeader: {
			padding: '0 0 16px 0',
		},
		scoreTitle: {
			display: 'flex',
			justifyContent: 'center',
			color: '#000',
		},
		scoreCredits: {
			display: 'flex',
			justifyContent: 'center',
			color: '#666',
		},
		arrangerName: {
			display: 'flex',
			justifyContent: 'flex-end',
			color: '#999',
		},
		softwareCredits: {
			display: 'flex',
			justifyContent: 'flex-end',
			color: '#999',
		},
	}));
	const classes = useStyles();

	const [stagePadding /*, setStagePadding*/] = useState(2.0);

	return (
		<>
			{score && (
				<Box id="StageUI" className={`${classes.root} no-scrollbar`} style={{ padding: `${stagePadding}cm` }}>
					<Box className={classes.content} style={{ width: `${21 - 2 * stagePadding}cm` }}>
						<Box className={classes.stageHeader}>
							<Typography variant="h4" className={classes.scoreTitle}>
								{score.scoreInfo.scoreTitle}
							</Typography>
							<Typography variant="h6" className={classes.scoreCredits}>
								{score.scoreInfo.scoreCredits}
							</Typography>
							<Typography variant="body2" className={classes.arrangerName}>
								Arranged by {score.scoreInfo.arrangerName}
							</Typography>
							<Typography variant="body2" className={classes.softwareCredits}>
								{`${AppDataHelper.appName} v${AppDataHelper.appVersion}`}
							</Typography>
						</Box>
						<Typography variant="h6">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nec feugiat nisl pretium
							fusce id. Vulputate eu scelerisque felis imperdiet. Non quam lacus suspendisse faucibus interdum posuere lorem. Commodo elit at imperdiet dui accumsan
							sit. Faucibus turpis in eu mi bibendum. Feugiat scelerisque varius morbi enim nunc faucibus. Scelerisque eu ultrices vitae auctor eu. Interdum velit
							euismod in pellentesque massa placerat duis ultricies. Turpis egestas integer eget aliquet nibh praesent tristique magna. Sit amet dictum sit amet. Non
							tellus orci ac auctor augue mauris augue neque gravida. Faucibus interdum posuere lorem ipsum dolor sit amet consectetur adipiscing. Consectetur a erat
							nam at lectus urna duis convallis. Leo vel fringilla est ullamcorper eget nulla facilisi etiam dignissim. Pellentesque id nibh tortor id aliquet lectus.
							Elementum sagittis vitae et leo duis ut diam. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Diam maecenas sed enim ut sem viverra. Nulla
							facilisi morbi tempus iaculis. In est ante in nibh mauris cursus mattis. Venenatis cras sed felis eget velit. Id consectetur purus ut faucibus pulvinar
							elementum integer. Id diam vel quam elementum pulvinar. Risus sed vulputate odio ut. Etiam non quam lacus suspendisse faucibus interdum posuere lorem.
							Dictumst quisque sagittis purus sit amet. Id porta nibh venenatis cras sed felis eget velit aliquet. Nam libero justo laoreet sit amet cursus. Ornare
							massa eget egestas purus viverra. Cras fermentum odio eu feugiat pretium. Dictum fusce ut placerat orci nulla pellentesque dignissim enim. Odio aenean
							sed adipiscing diam donec adipiscing tristique. Malesuada fames ac turpis egestas integer. Egestas maecenas pharetra convallis posuere morbi leo urna.
							Eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Mus mauris vitae ultricies leo integer malesuada. Lorem mollis aliquam ut porttitor leo a diam
							sollicitudin. Egestas fringilla phasellus faucibus scelerisque. Nullam ac tortor vitae purus faucibus ornare suspendisse. Interdum posuere lorem ipsum
							dolor sit amet. Egestas sed sed risus pretium. Luctus accumsan tortor posuere ac ut. Bibendum at varius vel pharetra vel turpis. Ut faucibus pulvinar
							elementum integer enim. Augue ut lectus arcu bibendum at varius. Id eu nisl nunc mi ipsum. Ac tincidunt vitae semper quis lectus nulla at volutpat. Id
							interdum velit laoreet id donec. Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque. Lacus sed viverra tellus in hac habitasse platea.
							A diam maecenas sed enim ut. Sollicitudin aliquam ultrices sagittis orci a. Scelerisque eleifend donec pretium vulputate. Sem viverra aliquet eget sit
							amet tellus cras adipiscing enim. Ultricies tristique nulla aliquet enim tortor at auctor. Elit scelerisque mauris pellentesque pulvinar pellentesque
							habitant morbi. Massa enim nec dui nunc mattis enim. Elementum nisi quis eleifend quam. Eu augue ut lectus arcu bibendum at varius. Aliquam faucibus
							purus in massa tempor nec feugiat. Arcu non sodales neque sodales. Cursus eget nunc scelerisque viverra mauris in aliquam sem. Egestas integer eget
							aliquet nibh. Ac tortor dignissim convallis aenean et. A diam maecenas sed enim ut sem viverra aliquet. Ante metus dictum at tempor commodo. Dolor purus
							non enim praesent elementum. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Sit amet aliquam id diam. In nibh mauris cursus
							mattis molestie a iaculis at erat. Sapien eget mi proin sed libero enim sed. Morbi non arcu risus quis varius. Sapien nec sagittis aliquam malesuada
							bibendum arcu vitae elementum. Integer eget aliquet nibh praesent tristique magna sit amet. In pellentesque massa placerat duis. Sapien nec sagittis
							aliquam malesuada bibendum arcu vitae elementum. Ac tincidunt vitae semper quis lectus nulla at. Ut tellus elementum sagittis vitae et. Elit ullamcorper
							dignissim cras tincidunt. Mauris a diam maecenas sed enim. Amet massa vitae tortor condimentum lacinia quis vel eros donec. Sed blandit libero volutpat
							sed cras ornare arcu. Velit laoreet id donec ultrices. Risus in hendrerit gravida rutrum quisque non tellus orci. Et malesuada fames ac turpis egestas
							maecenas pharetra convallis posuere. Amet dictum sit amet justo donec enim. Tristique magna sit amet purus gravida quis blandit turpis cursus. In nisl
							nisi scelerisque eu. Maecenas volutpat blandit aliquam etiam erat. Ac ut consequat semper viverra nam libero justo laoreet. Magna fringilla urna
							porttitor rhoncus dolor purus non. Vestibulum mattis ullamcorper velit sed. Mi ipsum faucibus vitae aliquet nec. Arcu cursus euismod quis viverra nibh.
							At ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Placerat duis ultricies lacus sed turpis tincidunt id aliquet risus. Scelerisque in
							dictum non consectetur a erat nam. At quis risus sed vulputate odio ut enim blandit volutpat. Metus dictum at tempor commodo ullamcorper a lacus
							vestibulum. Fermentum dui faucibus in ornare quam viverra orci sagittis eu. Auctor augue mauris augue neque gravida in fermentum et. Id porta nibh
							venenatis cras sed felis eget velit aliquet. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit. Dignissim sodales ut eu sem. Consectetur
							adipiscing elit pellentesque habitant morbi tristique senectus et netus. Sed odio morbi quis commodo odio aenean sed. Purus viverra accumsan in nisl
							nisi scelerisque eu ultrices. Pellentesque habitant morbi tristique senectus. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Est
							velit egestas dui id ornare arcu odio. Elit eget gravida cum sociis natoque. Enim blandit volutpat maecenas volutpat blandit aliquam etiam. Lectus magna
							fringilla urna porttitor rhoncus. Phasellus faucibus scelerisque eleifend donec. Fermentum leo vel orci porta non pulvinar. Ac felis donec et odio
							pellentesque. Sit amet consectetur adipiscing elit ut aliquam. Tristique magna sit amet purus gravida quis. Erat nam at lectus urna duis convallis
							convallis. In pellentesque massa placerat duis ultricies lacus sed. Diam donec adipiscing tristique risus nec feugiat in. Laoreet suspendisse interdum
							consectetur libero id faucibus. Amet aliquam id diam maecenas ultricies mi. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna. Proin
							libero nunc consequat interdum varius. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Penatibus et magnis dis parturient
							montes nascetur ridiculus mus. Neque vitae tempus quam pellentesque nec nam aliquam sem. Sit amet commodo nulla facilisi nullam vehicula ipsum. Orci
							dapibus ultrices in iaculis nunc. Turpis egestas pretium aenean pharetra magna ac placerat. Purus sit amet volutpat consequat mauris nunc congue nisi.
							At erat pellentesque adipiscing commodo. Donec adipiscing tristique risus nec feugiat in fermentum posuere urna. Feugiat pretium nibh ipsum consequat
							nisl vel pretium.
						</Typography>
					</Box>
				</Box>
			)}
		</>
	);
};
