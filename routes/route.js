import express from 'express';
import { portfolioData } from '../controllers/portfolio.js';

const router=express.Router()



const  portfolioRoute = router.get('/',portfolioData)

export{portfolioRoute}
