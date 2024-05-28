import express, { Request, Response } from 'express';
// import mongoose, { Schema, Document } from 'mongoose';
const app = express();
const PORT: string | number = process.env.PORT || 3001;
// const uri: string = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w&maj';

// interface ITask extends Document {
//   name: string;
//   description: string;
//   deadline: Date;
// }

// const taskSchema: Schema = new Schema({
//   name: String,
//   description: String,
//   deadline: Date
// });

// const Task = mongoose.model<ITask>('Task', taskSchema);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/tasks', async (req: Request, res: Response) => {
  // const tasks = await Task.find();
  // res.json(tasks);
  res.json({message: 'Endpoint temporarily unavailable'});
});

app.post('/tasks', async (req: Request, res: Response) => {
  // const task = new Task(req.body);
  // await task.save();
  // res.json(task);
  res.json({message: 'Endpoint temporarily unavailable'});
});

app.get('/tasks/:id', async (req: Request, res: Response) => {
  // const task = await Task.findById(req.params.id);
  // res.json(task);
  res.json({message: 'Endpoint temporarily unavailable'});
});

app.put('/tasks/:id', async (req: Request, res: Response) => {
  // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
  // res.json(task);
  res.json({message: 'Endpoint temporarily unavailable'});
});

app.delete('/tasks/:id', async (req: Request, res: Response) => {
  // await Task.findByIdAndDelete(req.params.id);
  // res.json({message: 'Task deleted'});
  res.json({message: 'Endpoint temporarily unavailable'});
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));