class ProjectsController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "Lovelace", only: [:new, :create, :edit, :new, :update, :destroy]
    $seq_dir = "#{Rails.root}/app/data/seq/"
    $inf_dir = "#{Rails.root}/app/data/inf_files/"
    $tmp_dir = "#{Rails.root}/app/data/tmp/"

    def index
        @vis = ['id', 'project_name', 'primary_site', 'num_of_samples', 'num_of_oberserved_genes', 'major_related_publications',"original_link"]
        @projects = Project.order(:project_name)
        @attrs = Project.column_names
        @invis = []
        @attrs.each_with_index do |attr, index|
            if !@vis.include?(attr)
                @invis.push(index+1)
            end
        end
        gon.push invis: @invis
        respond_to do |format|
            format.html
            format.csv { send_data @projects.to_csv }
            format.json { render json: ProjectDatatable.new(view_context) }
        end
    end
  
    def show
        @vis = ['id', 'sample_name', 'project_name', 'num_of_oberserved_genes', 'tissue_or_organ_of_origin', 'primary_diagnosis','gender', 'age', 'tumor_stage','ethnicity','vital_status']
        @user = User.find(session[:user_id])
        @project = Project.find(params[:id])
        @attrs = Project.column_names
        @sample_attrs = Sample.column_names
        @samples = @project.samples
        @invis = []
        @sample_attrs.each_with_index do |attr, index|
            if !@vis.include?(attr)
                @invis.push(index+1)
            end
        end
        gon.push invis: @invis
        
        id = session[:user_id]
        @user = User.find(id)
        @datasets = @user.datasets
        respond_to do |format|
            format.html
            format.csv { send_data @project.samples.to_csv }
            format.json { render json: ProjectSampleDatatable.new(view_context, @project) }
        end
    end
  
    def edit
        @attrs = Project.column_names
        @project = Project.find(params[:id])
        @sample_attrs = Sample.column_names
    end
  
    def destroy
        @project = Project.find(params[:id])
        @project.destroy
        redirect_to "/admin"
    end

    def import
        Project.import(params[:file])
        redirect_to '/admin', notice: "Projects imported."
    end

    def export_selected
        @projects = Project.order(:project_name)
        send_data @projects.selected_to_csv(params[:selected_ids])
    end

    def new
        @project = Project.new
        @attrs = Project.column_names
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

    def download_inf_table
        @project = Project.find(params[:id])
        name = @project.project_name
        send_file(
            "#{$inf_dir}#{name}.tsv",
                filename: "#{name}_inf.tsv",
        )
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
            params.require(:project).permit(:project_name, :primary_site, :major_related_publications)
        end
  
end
