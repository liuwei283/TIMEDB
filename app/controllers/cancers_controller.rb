class CancersController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "Lovelace", only: [:new, :create, :edit, :update, :destroy]
    $seq_dir = "#{Rails.root}/app/data/seq/"
    $inf_dir = "#{Rails.root}/app/data/inf_files/"
    $tmp_dir = "#{Rails.root}/app/data/tmp/"

    def index
        @vis = ['id', 'primary_site', 'num_of_projects', 'project_list', 'num_of_samples', 'data_type', 'program'] #changed later
        @cancers = Cancer.order(:cancer_type)
        @attrs = Cancer.column_names
        @invis = []
        @attrs.each_with_index do |attr, index|
            if !@vis.include?(attr)
                @invis.push(index+1)
            end
        end
        gon.push invis: @invis
        respond_to do |format|
            format.html
            format.csv { send_data @cancers.to_csv }
            format.json { render json: CancerDatatable.new(view_context) }
        end
    end

    #show details of the primary site and will be considered to transformed to popover format
    def show
        @vis = ['id', 'project_name', 'primary_site', 'num_of_samples', 'num_of_oberserved_genes', 'major_related_publications',"original_link"] # changed later
        @user = User.find(session[:user_id])
        @cancer = Cancer.find(params[:id])
        @attrs = Cancer.column_names
        @project_attrs = Project.column_names
        @projects = @cancer.projects
        @invis = []
        @project_attrs.each_with_index do |attr, index|
            if !@vis.include?(attr)
                @invis.push(index+1)
            end
        end
        gon.push invis: @invis
        
        id = session[:user_id]
        @user = User.find(id) # for import the selected samples to datasets of the current user
        @datasets = @user.datasets
        respond_to do |format|
            format.html
            format.csv { send_data @cancer.projects.to_csv }
            format.json { render json: CancerProjectDatatable.new(view_context, @cancer) }
        end
    end

  
    def edit
        @attrs = Cancer.column_names
        @cancer = Cancer.find(params[:id])
        @project_attrs = Project.column_names
    end
  
    def destroy
        @cancer = Cancer.find(params[:id])
        @cancer.destroy
        redirect_to "/admin"
    end

    def import
        Cancer.import(params[:file])
        redirect_to '/admin', notice: "Cancers imported."
    end

    def export_selected
        @cancers = Cancer.order(:cancer_type)
        send_data @cancers.selected_to_csv(params[:selected_ids])
    end

    def new
        @cancer = Cancer.new
        @attrs = Cancer.column_names
    end
  
    def create        
        @cancer = Cancer.new(cancer_params)
        if @cancer.save
            @cancer.update_attribute(:num_of_projects, @cancer.projects.count)
            redirect_to @cancer
        else
            render 'new'
        end
    end

    def update
        @cancer = Cancer.find(params[:id])
        
        if @cancer.update(cancer_params)
            redirect_to @cancer
        else
            render 'edit'
        end
    end
  
    private 
        def cancer_params
            params.require(:cancer).permit(:primary_site, :project_list, :num_of_projects, :num_of_samples, :data_type, :program, :cover_image)
        end
  
end
