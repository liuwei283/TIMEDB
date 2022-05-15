class ProjectsController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "Lovelace", only: [:new, :create, :edit, :new, :update, :destroy]
    $seq_dir = "#{Rails.root}/app/data/seq/"
    $inf_dir = "#{Rails.root}/public/data/sample_plot/"
    $tmp_dir = "#{Rails.root}/app/data/tmp/"
    $data_dir = "#{Rails.root}/public/data/"


    
    def index
        @vis = ['id', 'project_name', 'cancer_name', 'num_of_samples', 'preprocessed', 'database', "original_description", "major_related_publications"]
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

        @project = Project.find(params[:id])
        @pname = @project.project_name


        @vis = ['id', 'sample_name', 'project_name', 'c_tumor_stage', 'c_tumor_grade', 'c_sample_histology', 'c_race', 'c_gender', 'n_age', 'pfs', 'os', 'pfs_status', 'os_status', 'c_tumor_type', 'c_tumor_subtype', 'c_source_name', 'c_treatment']

        @user = User.find(session[:user_id])
       
        @cancer = Cancer.find(@project.cancer_id)
        @ctype = @cancer.cancer_name
        @attrs = Project.column_names
        @sample_attrs = Sample.column_names
        @samples = @project.samples
        @invis = []
        @sample_attrs.each_with_index do |s_attr, index|
            if !@vis.include?(s_attr)
                @invis.push(index+1)
            end
        end

        
        id = session[:user_id]
        @user = User.find(id)
        @datasets = @user.datasets


        #table data to be changed
        table_file_path = $data_dir + "processedColumns/" + @pname + ".tsv"

        @table_data = []

        @table_info_exist = File.file?(table_file_path)

        if(@table_info_exist)
            File.readlines(table_file_path).each_with_index do |line, i|
                #line = line.gsub(/"/, '' )
                contents = line.chomp.split("\t")
                if i == 0
                    @table_header = contents
                else 
                    @table_data.push([contents])
                end
            end
        end

        # transfer columns names to project fraction oerview
        @selector_attrs = []
        @sample_attrs.each do |s_attr|
            if s_attr.include?("c_")
                @selector_attrs.push(s_attr.gsub("c_", ""))
            end
        end

        pname = @project.project_name
        sample_clinical_file_path = "#{Rails.root}/public/data/clinical/sample/Clinical_#{pname}.csv"
        samples_info = CSV.parse(File.read(sample_clinical_file_path), headers: TRUE)
        
        @table_headers = ['id']
        @table_headers.concat(samples_info.headers)

        @samples_info = samples_info.map(&:to_h)

        logger.error '----------------------'
        @samples_info.each do |row_info|
            cur_sname = row_info['sample_name']
            logger.error cur_sname
            cur_sid = Sample.find_by(sample_name:cur_sname).id
            row_info['id'] = cur_sid
        end

        respond_to do |format|
            format.html
            format.csv { send_data @project.samples.to_csv }
            format.json { render json: ProjectSampleDatatable.new(view_context, @samples_info, @table_headers) }
        end

        gon.push invis: @invis,
        project_name: @pname,
        cancer_type: @ctype

    end

    def overview
        @project = Project.find(params[:id])
        
       ###changed later
      
        #here we can push some data

        gon.push table_data: @table_data       
    end

  
    def edit
        @attrs = Project.column_names
        @project = Project.find(params[:id])
        @sample_attrs = Sample.column_names
    end

    def visualize 
        @project = Project.find(params[:id])
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
        @attrs = Project.column_names
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
            params.require(:project).permit(:project_name, :cancer_name, :num_of_samples, :cancer_id)
        end
  
end
