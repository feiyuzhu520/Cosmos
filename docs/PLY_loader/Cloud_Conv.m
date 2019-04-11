[Vertex,Color,Face]=plyRead('surface-L2-clean.ply',1,1);
X=Vertex(:, 1);
Y=Vertex(:, 2);
Z=Vertex(:, 3);

%X=MV_points(X);
Y=MV_points(Y);
Z=MV_points(Z);

Vertex(:,1)=X;
Vertex(:,2)=Y;
Vertex(:,3)=Z;

write_ply(Vertex,Color,Face,'surface_moved.ply')

function y=MV_points(x)

Min=min(x);
Max=max(x);

y=x-(Max+Min)/2;

end