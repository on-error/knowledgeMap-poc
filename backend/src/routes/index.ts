import { Router } from 'express';
import { prisma } from '../lib/prisma';
import multer from 'multer';
import { processFile } from '../utils/pdfUtil';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET route for testing (you can remove this later)
router.get('/upload-file/:userId', async (req, res) => {
  res.json({
    message: 'This endpoint accepts POST requests for file uploads',
    userId: req.params.userId,
    method: 'Use POST with multipart/form-data containing a file'
  });
});

router.post('/create-user', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.create({
    data: {
      email,
      password,
    },
  });

  res.json({
    message: 'User created successfully',
    user,
  });
});


router.post('/upload-file/:userId', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const file = req.file;
  const fileInfo = await prisma.fileInfo.create({
    data: {
      fileName: file.originalname,
      fileType: file.mimetype,
      userId: req.params.userId,
    },
  });

  processFile(file.path, req.params.userId, fileInfo.id);

  res.json({
    message: 'File uploaded successfully',
    fileInfo,
  });
});

router.get('/get-map/:userId', async (req, res) => {
  const nodes = await prisma.node.findMany({
    where: {
      userId: req.params.userId,
    },
  });

  const edges = await prisma.edge.findMany({
    where: {
      userId: req.params.userId,
    },
  });

  res.json({ nodes, edges });
});

router.get('/get-files/:userId', async (req, res) => {
  const files = await prisma.fileInfo.findMany({
    where: {
      userId: req.params.userId,
    },
  });

  res.json({ message: 'Files fetched successfully', files });
});

router.delete('/delete-file/:fileId', async (req, res) => {
  await prisma.fileInfo.delete({
    where: {
      id: req.params.fileId,
    }
  });

  res.json({ message: 'File deleted successfully' });
});


export default router;