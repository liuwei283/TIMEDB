class ProjectsController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "chelijia",
    except: [:index, :show]

    def index
        @projects = Project.order(:name)
        @attrs = Project.column_names
        respond_to do |format|
            format.html
            format.csv { send_data @projects.to_csv }
        end
    end
  
    def show
        @project = Project.find(params[:id])
        @sample_attrs = Sample.column_names
        respond_to do |format|
            format.html
            format.csv { send_data @project.samples.to_csv }
        end
    end
  
    def edit
        @project = Project.find(params[:id])
    end
  
    def destroy
        @project = Project.find(params[:id])
        @project.destroy
         
        redirect_to projects_path
    end

    def import
        Project.import(params[:file])
        redirect_to projects_path, notice: "Projects imported."
    end

    def export_selected
        @projects = Project.order(:name)
        respond_to do |format|
            format.csv {send_data @projects.selected_to_csv(params[:project_ids])}
        end
    end

    def new
        @project = Project.new
    end
  
    def create        
        @project = Project.new(project_params)
        if @project.save
            @project.update_attribute(:num_of_samples, @project.samples.count)
            redirect_to @project
        else
            render 'new'
        end
    end
  
    def update
        @project = Project.find(params[:id])
         
        if @project.update(project_params)
          redirect_to @project
        else
          render 'edit'
        end
    end
  
    private 
        def project_params
            params.require(:project).permit(:name, :related_publications)
        end
  
end
