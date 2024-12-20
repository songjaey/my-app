import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(req: NextRequest, res: NextResponse) 
{
  try {
    const body = await req.json();
    console.log('body', body);
    const nodeCount = body.nodeCount;
    const elementCount = body.elementCount;
    console.log('nodeCount', nodeCount);
    console.log('elementCount', elementCount);
    // 실행 파일 경로
    const programPath = path.join(process.cwd(), 'cpp_source/bin/analysis_program.exe');

    const { stdout, stderr } = await execAsync(
      `"${programPath}" ${nodeCount} ${elementCount}`
    );

    if (stderr) {
      throw new Error(stderr);
    }
    const result = JSON.parse(stdout);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Execution error:', error);
    // res.status(500).json({ 
    //   error: 'Execution failed'
    // });
  }
}