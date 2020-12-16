class ProjectsController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "chelijia",
    except: [:index, :show]

    $seq_dir = "#{Rails.root}/app/data/seq/"
    $abd_dir = "#{Rails.root}/app/data/abd_files/"
    $tmp_dir = "#{Rails.root}/app/data/tmp/"
    $user_stor_dir = "#{Rails.root}/data/user"

    def index
        @projects = Project.order(:name)
        @attrs = Project.column_names
        respond_to do |format|
            format.html
            format.csv { send_data @projects.to_csv }
        end
    end
  
    def show
        @user = User.find(cookies.encrypted[:user])
        @project = Project.find(params[:id])
        @sample_attrs = Sample.column_names
        id = cookies.encrypted[:user]
        @user = User.find(id)
        user_dir = File.join($user_stor_dir, id.to_s)
        @datasets = @user.datasets
        respond_to do |format|
            format.html
            format.csv { send_data @project.samples.to_csv }
        end
    end
  
    def edit
        @attrs = Project.column_names
        @project = Project.find(params[:id])
    end
  
    def destroy
        @project = Project.find(params[:id])
        @project.destroy
        redirect_to projects_path
    end

    def import
        Project.import(params[:file])
        update_metadata
        redirect_to projects_path, notice: "Projects imported."
    end

    def export_selected
        @projects = Project.order(:name)
        send_data @projects.selected_to_csv(params[:project_ids])
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

    def download_abd_table
        @project = Project.find(params[:id])
        name = @project.name
        send_file(
            "#{$abd_dir}#{name}.csv",
                filename: "#{name}_abd.csv",
        )
    end
  
    def update
        @project = Project.find(params[:id])
         
        if @project.update(project_params)
            update_metadata
            redirect_to @project
        else
            render 'edit'
        end
    end
  
    private 
        def update_metadata
            @projects = Project.order(:name)
            db_projects_info_path = File.join Rails.root, 'app', 'data', 'db', 'projects_metadata.csv'
            csv_file = @projects.to_csv
            File.open(db_projects_info_path, 'w') do |file|
                file << csv_file
            end
        end

        def send_selected
        end

        def project_params
            params.require(:project).permit(:name, :related_publications)
        end
  
end
