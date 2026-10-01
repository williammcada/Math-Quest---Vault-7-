import {build} from 'esbuild';
import {readFileSync,writeFileSync} from 'node:fs';
const result=await build({entryPoints:['public/ironbreak-review.js'],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',loader:{'.svg':'dataurl'},minify:true});
const html=readFileSync('public/ironbreak-review.html','utf8').replace('<link rel="stylesheet" href="games/shooter/host.css">','<style>'+readFileSync('public/games/shooter/host.css','utf8')+'</style>').replace('<script type="module" src="ironbreak-review.js"></script>',()=>'<script>'+result.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script>');
writeFileSync('public/Ironbreak-v0.1.0-cartridge-review.html',html);console.log('Built offline cartridge review: '+Buffer.byteLength(html)+' bytes');
