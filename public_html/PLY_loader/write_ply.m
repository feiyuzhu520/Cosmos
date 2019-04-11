function write_ply(vertex,color,face,filename)

fid=fopen(filename,'W');
fprintf(fid,'ply\n');
fprintf(fid,'format ascii 1.0\n');
fprintf(fid,'comment Vis LAB\n');
fprintf(fid,'element vertex %d\n',length(vertex));
fprintf(fid,'property float x\n');
fprintf(fid,'property float y\n');
fprintf(fid,'property float z\n');

fprintf(fid,'property uchar red\n');
fprintf(fid,'property uchar green\n');
fprintf(fid,'property uchar blue\n');

fprintf(fid,'element face %d\n',length(face));
fprintf(fid,'property list uchar int vertex_index\n');
fprintf(fid,'end_header\n');

for i=1:length(vertex)
    fprintf(fid,'%f  %f %f %d %d %d\n',vertex(i,1),vertex(i,2),vertex(i,3),color(i,1),color(i,2),color(i,3));   
end

for i=1:length(face)
    fprintf(fid,'%d ',3);
    %%%%print a newline at end of 3.
    fprintf(fid,'%d %d %d\n',face(i,1)-1,face(i,2)-1,face(i,3)-1);
end

fclose(fid);