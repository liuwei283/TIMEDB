class DatabaseController < ApplicationController
    $db_data_dir = File.join(Rails.root, "data", "static_viz_data")

    def overview
        @cancers = Cancer.order(:cancer_name)
        @kidneyIcon = ["Kidney Chromophobe", "Kidney Renal Clear Cell Carcinoma", "Wilms Tumor", "Clear Cell Sarconma of the Kidney", "Kidney Renal Papillary Cell Carcinoma"]
        @leukemiaIcon = ["Acute Myeloid Leukemia", "Chronic Myelogenous Leukemia", "Acute lymphocytic leukemia", "Acute lymphocytic leukemia"]
        #@singleIcon = []
        #@groupedCancers = []
        @kidneyCancers = []
        @leukemiaCancers = []
        @singleCancers = []
        @cancers.each do |cancer|
            theCancer = cancer.cancer_type
            if @kidneyIcon.include?(theCancer)
                @kidneyCancers.push(cancer)
            elsif @leukemiaIcon.include?(theCancer)
                @leukemiaCancers.push(cancer)
            elsif theCancer != "Other"
                @singleCancers.push(cancer)
            end
        end

        cancers_projects = {}
        cancers = []
        @cancers.each do |cancer|
            cname = cancer.cancer_name
            cancers.push(cname)
            cur_projects = []
            cancer.projects.each do |project|
                cur_projects.push(project.project_name)
            end
            cancers_projects[cname] = cur_projects
        end
        @cancer_attrs = Cancer.column_names
        gon.push cancers: cancers, projects: cancers_projects

        @cnum = Cancer.all.count
        @pnum = Project.all.count
        @snum = Sample.all.count

        csf_path = "#{Rails.root}/public/data/project_files.csv"
        csv_text = File.read(csf_path) 
        @csv_test = {}

        csv_text = CSV.parse(csv_text, :headers => true)
        csv_text.each do |row|

            @csv_test[row.to_hash['project_name']] =row.to_hash

        end
        gon.push files: @csv_test
        
    end

    def download_bar_file
        name = params[:bar_selected]
        send_file(
            "#{Rails.root}/data/overview/" + name + "_samples.tsv",
            filename: "samples_num.tsv",
            type: "application.tsv"
        )
    end

    def refreshSelector
        logger.info "hgfg"
        cancer_id = params[:cancer_id]
        cancer = Cancer.find(cancer_id)
        projects = cancer.projects.order(:project_name)
        pjs_json = []
        projects.each do |pj|
            pj_json = {
                "name" => pj.project_name
            }
            pjs_json << pj_json
        end
        respond_to do |format|
            format.json {render json: pjs_json}
        end
    end

    def get_drop_down_projects
        val = params[:cancer_id]
        #Use val to find records
        options = Cancer.find(val).projects.collect{|x| "'' : '#{x.project_name}'"}    
        render :text => "{#{options.join(",")}}" 
    end
    def download
        csf_path = "#{Rails.root}/public/data/project_files.csv"
        csv_text = File.read(csf_path) 
        @csv_test = {}
        @attrs1 = ['id','project_name','Gene expression data','meta data','scaled data']
        @attrs2 = ['id', 'project_name','CIBERSORT','CIBERSORTX','ABIS','ImmucellAI','xCell','ConsensusTME','MCPcounter','EPIC','TIMER','quanTIseq'];
        @attrs3 = ['id','project_name','All_method','Consensus Cell']
        @attrs4 = ['id','project_name','C1-C6 Subtype']

        csv_text = CSV.parse(csv_text, :headers => true)
        csv_text.each do |row|
            @csv_test[row.to_hash['project_name']] =row.to_hash
        end
        @projects= Project.order(:id)
    end
end
